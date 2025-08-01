
import { Router } from "express";
import { authMiddleware } from "../middleware";
import prisma from "../db";

const router = Router();


router.get("/get-actions", authMiddleware, async (req, res) => {
     try{

        const actions = await prisma.availableAction.findMany({});

        if(!actions){
            return res.status(404).json({
                message: "No Actions Found",
            });
        }

        return res.status(200).json({
            message: "Actions",
            actions,
        });

     }
     catch(e){
        console.error(e);
         return res.status(400).json({
             message: "Server Error",
         });
     }
})

export const actionRouter = router;