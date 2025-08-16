
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { LoginSchema, SignupSchema } from "../types";
import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../sentEmail";
import { generateOTP } from "../OTP";

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
            const userExist = await prisma.user.findFirst({
                where: {
                    email: email,
                },
            }) ; 
    
            if(userExist){
                res.status(403).json({
                    message: "User Already Exist",

                });
            }

            
            //  hashed password
            const hashedPassword = await bcrypt.hash(password, 10); 

            const newUser =  await prisma.user.create({
                data : {
                    name : name,
                    email : email,
                    password : hashedPassword,
                    isVerified : false
                }
            })

            const OTP = generateOTP(); 
            await sendEmail(email, "Welcome to Zapier", `Your OTP is ${OTP}`);

            console.log("Reached here - I")

            await prisma.otp.create({
                data : {
                    userId : newUser.id,
                    otp : String(OTP)
                }
            });

            console.log("Reached here - II")

            response = res.status(201).json({
                message : "OTP Send, Please very the User..."  
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

router.post("/verify-otp", async (req, res) => {
    try{
        console.log("Hit here");
        console.log("req.body", req.body);
        const { otp } = req.body;
        console.log("otp", otp);

        if(!otp){
            return res.status(400).json({
                message : "OTP is required",
            })
        };

        const OtpData = await prisma.otp.findFirst({
            where : {
                otp : otp
            }
        });

        console.log("Hit here - I");

        if(!OtpData){
            return res.status(404).json({
                message : "OTP not found",
            })
        };

        await prisma.user.update({
            where : {
                id : OtpData.userId
            },
            data : {
                isVerified : true
            }
        });

        console.log("Hit here - II");

        // delete otp
        await prisma.otp.delete({
            where : {
                id : OtpData.id
            }
        });

        return res.status(200).json({
            message : "User Created"
        })

    }
    catch(e){
        return res.status(502).json({
            message : "Server Error",
            error : e
        })
    }
})

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

        const link = `${process.env.FRONTEND_URL}/update-password?token=${token}`;

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

export const userRouter = router;