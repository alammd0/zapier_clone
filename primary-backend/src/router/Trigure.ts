
import { Router } from "express";
import { authMiddleware } from "../middleware";
import prisma from "../db";

const router = Router();

router.get("/get-triggers", authMiddleware, async (req, res) => {
    try{
        const triggers = await prisma.availableTriggers.findMany({}); 

        if(!triggers){
            return res.status(404).json({
                message: "No Triggers Found",
            });
        }

        return res.status(200).json({
            message: "Triggers",
            triggers,
        });
    }
    catch(e){
        console.error(e)
        return res.status(400).json({
            message: "Server Error",
        });
    }
})

export const TriggerRouter = router;