"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = __importDefault(require("../db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sentEmail_1 = require("../sentEmail");
const router = (0, express_1.Router)();
router.post("/signup", async (req, res) => {
    try {
        const user = req.body;
        const parsedUser = types_1.SignupSchema.safeParse(user);
        let response = null;
        if (!parsedUser.success) {
            res.status(411).json({
                message: "Invalid Data",
                error: parsedUser.error,
            });
        }
        else {
            const { name, email, password } = parsedUser.data;
            // check user exist or not
            const useExist = await db_1.default.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (useExist) {
                res.status(403).json({
                    message: "User Already Exist",
                });
            }
            //  hashed password
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const newUser = await db_1.default.user.create({
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
        }
        ;
        return response;
    }
    catch (e) {
        return res.status(400).json({
            message: "Server Error",
            error: e,
        });
    }
});
router.post("/login", async (req, res) => {
    try {
        const body = req.body;
        const parsedUser = types_1.LoginSchema.safeParse(body);
        let response = null;
        if (!parsedUser.success) {
            res.status(411).json({
                message: "Invalid Data",
                error: parsedUser.error,
            });
        }
        else {
            const { email, password } = parsedUser.data;
            const user = await db_1.default.user.findFirst({
                where: {
                    email: email,
                },
            });
            if (!user) {
                return res.status(401).json({
                    message: "User Not Found",
                    error: user,
                });
            }
            const isPasswordCorrect = await bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    message: "Invalid Password",
                    error: isPasswordCorrect,
                });
            }
            // sign token
            const token = jsonwebtoken_1.default.sign({ userId: user.id, password: user.password }, process.env.JWT_SECRET);
            response = res.status(200).json({
                message: "Login Success",
                data: {
                    token: token,
                },
            });
        }
        return response;
    }
    catch (e) {
        return res.status(400).json({
            message: "Server Error",
            error: e,
        });
    }
});
router.get("/getuser", middleware_1.authMiddleware, async (req, res) => {
    try {
        // @ts-ignore
        const user = req.id;
        const userData = await db_1.default.user.findUnique({
            where: {
                id: user,
            },
            select: {
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
    }
    catch (error) {
        res.status(400).json({
            message: "Server Error",
            error: error,
        });
    }
});
router.post("/send-email", async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required",
                error: null
            });
        }
        ;
        // find user by email
        const user = await db_1.default.user.findFirst({
            where: {
                email: email
            },
            select: {
                password: false,
                id: true,
                email: true
            }
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                error: null
            });
        }
        const options = {
            id: user.id,
            email: user.email
        };
        const token = jsonwebtoken_1.default.sign(options, process.env.JWT_SECRET);
        const link = `${process.env.FRONTEND_URL}/forgot-password?token=${token}`;
        const html = `<h1>Welcome to Zapier</h1><p>Please click the link below to reset your password</p><a href="${link}">Reset Password</a>`;
        await (0, sentEmail_1.sendEmail)(email, "Welcome to Zapier", html);
        return res.status(200).json({
            message: "Email Sent",
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Server Error",
            error: e
        });
    }
});
router.put("/update-password", async (req, res) => {
    try {
        const token = req.query.token;
        if (!token) {
            return res.status(400).json({
                message: "Token is required",
                error: null
            });
        }
        ;
        const { password, confirmPassword } = req.body;
        if (!password || !confirmPassword) {
            return res.status(400).json({
                message: "Password and Confirm Password are required",
                error: null
            });
        }
        ;
        if (password !== confirmPassword) {
            return res.status(400).json({
                message: "Password and Confirm Password do not match",
                error: null
            });
        }
        // here we are decoding the token
        let decoded = null;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        }
        catch (e) {
            return res.status(401).json({
                message: "Expired token, Please Generate New Token",
                error: e
            });
        }
        ;
        const findUser = await db_1.default.user.findFirst({
            where: {
                email: decoded.email
            },
            select: {
                id: true,
                password: false
            }
        });
        if (!findUser) {
            return res.status(404).json({
                message: "User not found",
                error: null
            });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await db_1.default.user.update({
            where: {
                id: findUser.id
            },
            data: {
                password: hashedPassword
            }
        });
        return res.status(200).json({
            message: "Password Updated",
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Server Error",
            error: e
        });
    }
});
exports.userRouter = router;
