"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const useExist = yield db_1.default.user.findFirst({
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
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const newUser = yield db_1.default.user.create({
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
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            const user = yield db_1.default.user.findFirst({
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
            const isPasswordCorrect = yield bcryptjs_1.default.compare(password, user.password);
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
}));
router.get("/getuser", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = req.id;
        const userData = yield db_1.default.user.findUnique({
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
}));
exports.userRouter = router;
