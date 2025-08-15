"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.post("/create-zap", middleware_1.authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = types_1.ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const zapId = await db_1.default.$transaction(async (tx) => {
        const zap = await db_1.default.zap.create({
            data: {
                userId: id,
                triggerId: "",
                action: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetadata ?? {},
                    })),
                },
            },
        });
        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
                metadata: parsedData.data.triggerMetadata,
            },
        });
        await tx.zap.update({
            where: {
                id: zap.id,
            },
            data: {
                triggerId: trigger.id,
            },
        });
        return zap.id;
    });
    return res.json({
        message: "Zap Created",
        zapId: zapId,
    });
});
router.get("/get-zaps", middleware_1.authMiddleware, async (req, res) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await db_1.default.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            action: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
            user: {
                select: {
                    id: true,
                }
            }
        },
    });
    return res.json({
        zaps,
    });
});
router.get("/get-zap/:zapId", middleware_1.authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zap = await db_1.default.zap.findFirst({
        where: {
            id: zapId,
            userId: id,
        },
        include: {
            action: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        },
    });
    return res.json({
        zap,
    });
});
router.post("/update-zap/:zapId", middleware_1.authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const body = req.body;
    const parsedData = types_1.ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const updatedZap = await db_1.default.$transaction(async (tx) => {
        // 1. Delete existing actions
        await tx.action.deleteMany({
            where: {
                zapId: zapId,
            },
        });
        // 2. Create new actions
        const newActions = await Promise.all(parsedData.data.actions.map(async (x, index) => {
            return await tx.action.create({
                data: {
                    actionId: x.availableActionId,
                    sortingOrder: index,
                    metadata: x.actionMetadata,
                    zapId: zapId,
                }
            });
        }));
        // 3. Update trigger
        const updatedTrigger = await tx.trigger.update({
            where: {
                zapId: zapId,
            },
            data: {
                triggerId: parsedData.data.availableTriggerId,
                metadata: parsedData.data.triggerMetadata,
            },
        });
        return {
            actions: newActions,
            trigger: updatedTrigger,
        };
    });
    return res.json({
        message: "Zap Updated",
        updatedZap,
    });
});
exports.zapRouter = router;
