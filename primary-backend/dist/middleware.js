"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized",
            error: "No token provided",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Unauthorized",
                error: "Invalid Token",
            });
        }
        // @ts-ignore
        req.id = decoded.userId;
        next();
    }
    catch (e) {
        res.status(401).json({
            message: "Unauthorized",
            error: e,
        });
    }
};
exports.authMiddleware = authMiddleware;
