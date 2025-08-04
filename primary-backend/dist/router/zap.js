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
exports.zapRouter = void 0;
const express_1 = require("express");
const middleware_1 = require("../middleware");
const types_1 = require("../types");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.post("/create-zap", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = types_1.ZapCreateSchema.safeParse(body);
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs",
        });
    }
    const zapId = yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zap = yield tx.zap.create({
            data: {
                userId: id,
                triggerId: "",
                action: {
                    create: parsedData.data.actions.map((x, index) => {
                        var _a;
                        return ({
                            actionId: x.availableActionId,
                            sortingOrder: index,
                            metadata: (_a = x.actionMetadata) !== null && _a !== void 0 ? _a : {},
                        });
                    }),
                },
            },
        });
        const trigger = yield tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
                metadata: parsedData.data.triggerMetadata,
            },
        });
        yield tx.zap.update({
            where: {
                id: zap.id,
            },
            data: {
                triggerId: trigger.id,
            },
        });
        return zap.id;
    }));
    return res.json({
        message: "Zap Created",
        zapId: zapId,
    });
}));
router.get("/get-zaps", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const zaps = yield db_1.default.zap.findMany({
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
        },
    });
    return res.json({
        zaps,
    });
}));
router.get("/get-zap/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zap = yield db_1.default.zap.findFirst({
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
}));
router.post("/update-zap/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const updatedZap = yield db_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        // 1. Delete existing actions
        yield tx.action.deleteMany({
            where: {
                zapId: zapId,
            },
        });
        // 2. Create new actions
        const newActions = yield Promise.all(parsedData.data.actions.map((x, index) => __awaiter(void 0, void 0, void 0, function* () {
            return yield tx.action.create({
                data: {
                    actionId: x.availableActionId,
                    sortingOrder: index,
                    metadata: x.actionMetadata,
                    zapId: zapId,
                }
            });
        })));
        // 3. Update trigger
        const updatedTrigger = yield tx.trigger.update({
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
    }));
    return res.json({
        message: "Zap Updated",
        updatedZap,
    });
}));
exports.zapRouter = router;
