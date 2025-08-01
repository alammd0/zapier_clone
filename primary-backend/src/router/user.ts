
import { Router } from "express";
import { authMiddleware } from "../middleware";
import { LoginSchema, SignupSchema } from "../types";
import prisma from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

export const userRouter = router;