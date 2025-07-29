import {Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req : Request, res : Response, next : NextFunction) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            message: "Unauthorized",
            error: "No token provided",
        });
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if(!decoded){
            return res.status(401).json({
                message: "Unauthorized",
                error: "Invalid Token",
            });
        }
        // @ts-ignore
        req.id = decoded.userId;
        next();
    }catch(e){
        res.status(401).json({
            message: "Unauthorized",
            error: e,
        });
    }
}