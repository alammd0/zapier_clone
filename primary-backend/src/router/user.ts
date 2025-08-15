
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { LoginSchema, SignupSchema } from "../types";
import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../sentEmail";
import { error } from "console";

const router = Router();

router.post("/signup", async  (req, res) => {
    try{
        const user = req.body;
        const parsedUser = SignupSchema.safeParse(user);

        let response = null;

        if(!parsedUser.success){
            res.status(411).json({
                message: "Invalid Data",
                error: parsedUser.error,
            });
        }
        else{
            const { name, email, password } = parsedUser.data ; 
            
            // check user exist or not
            const useExist = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            }) ; 
    
            if(useExist){
                res.status(403).json({
                    message: "User Already Exist",

                });
            }
    
            //  hashed password
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const newUser = await prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hashedPassword,
                },
            });

            response = res.status(201).json({
                message: "User Created",
                data: newUser,
            });
        };

        return response;
    }
    catch(e){
        return res.status(400).json({
            message: "Server Error",
            error: e,
        });
}});

router.post("/login", async (req, res) => {
    try{
        const body = req.body;
        const parsedUser = LoginSchema.safeParse(body);

        let response = null;
        
        if(!parsedUser.success){
            res.status(411).json({
                message: "Invalid Data",
                error: parsedUser.error,
            });
        }
        else{
            const { email, password } = parsedUser.data;

            const user = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            });

            if(!user){
                return res.status(401).json({
                    message: "User Not Found",
                    error: user,
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, user.password);

            if(!isPasswordCorrect){
                return res.status(401).json({
                    message: "Invalid Password",
                    error: isPasswordCorrect,
                });
            }

            // sign token
            const token = jwt.sign({ userId: user.id, password : user.password}, process.env.JWT_SECRET as string); 

            response =  res.status(200).json({
                message: "Login Success",
                data: {
                    token: token,
                },
            });
        }

        return response;

    }
    catch(e){
        return res.status(400).json({
            message: "Server Error",
            error: e,
        });
    }
})

router.get("/getuser", authMiddleware, async (req, res) => {
    try{
        // @ts-ignore
        const user = req.id;

        const userData = await prisma.user.findUnique({
            where: {
                id: user,
            },
            select : {
                id: true,
                name: true,
                email: true,
                password: false,
            }
        });

        res.status(200).json({
            message: "User Data",
            data: userData,
        });
    }catch(error){
        res.status(400).json({
            message: "Server Error",
            error: error,
        });
    }
})

router.post("/send-email", async (req, res) => {
    try {

        const { email } = req.body; 

        if(!email){
            return res.status(400).json({
                message : "Email is required",
                error : null
            })
        };

        // find user by email
        const user =  await prisma.user.findFirst({
            where : {
                email : email
            },
            select : {
                password : false,
                id : true,
                email : true
            }
        } );

        if(!user){
            return res.status(404).json({
                message : "User not found",
                error : null
            })
        }

        const options = {
            id : user.id,
            email : user.email
        };

        const token  = jwt.sign(options, process.env.JWT_SECRET as string);

        const link = `${process.env.FRONTEND_URL}/forgot-password?token=${token}`;

        const html = `<h1>Welcome to Zapier</h1><p>Please click the link below to reset your password</p><a href="${link}">Reset Password</a>`;

        await sendEmail(email, "Welcome to Zapier", html);

        return res.status(200).json({
            message : "Email Sent",
        })
    }
    catch(e){
        return res.status(500).json({
            message : "Server Error",
            error : e
        })
    }
})

router.put("/update-password", async (req, res) => {
    try {

        const token = req.query.token as string;

        if(!token){
            return res.status(400).json({
                message : "Token is required",
                error : null
            })
        };

        const { password, confirmPassword } = req.body ; 

        if(!password || !confirmPassword) { 
            return res.status(400).json({
                message : "Password and Confirm Password are required",
                error : null
            })
        };

        if(password !== confirmPassword){
            return res.status(400).json({
                message : "Password and Confirm Password do not match",
                error : null
            })
        }

        // here we are decoding the token
        let decoded = null;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        }
        catch(e){
            return res.status(401).json({
                message : "Expired token, Please Generate New Token",
                error : e
            })
        };

        const findUser = await prisma.user.findFirst({
            where : {
                email : decoded.email
            },
            select : {
                id : true,
                password : false
            }
        });

        if(!findUser){
            return res.status(404).json({
                message : "User not found",
                error : null
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where : {
                id : findUser.id
            },
            data : {
                password : hashedPassword
            }
        }); 

        return res.status(200).json({
            message : "Password Updated",
        })

    }
    catch(e){
        return res.status(500).json({
            message : "Server Error",
            error : e
        })
    }
});

// Add feature like if new user register then first very with OTP then Go to login Page and if OTP is correct then login

export const userRouter = router;