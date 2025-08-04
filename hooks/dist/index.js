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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/hooks/catch/:user/:zapId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.params.user;
    const zapId = req.params.zapId;
    const body = req.body;
    // store in db a new trigger for this user
    // create transition for this user 
    console.log("Rich Hook Called");
    yield prisma.$transaction((tsx) => __awaiter(void 0, void 0, void 0, function* () {
        // create a new zapRun
        console.log("Creating a new ZapRun");
        const run = yield tsx.zapRun.create({
            data: {
                zapId: zapId,
                metaData: body,
            },
        });
        console.log("Creating a new ZapRunOutBox");
        yield tsx.zapRunOutBox.create({
            data: {
                zapRunId: run.id,
            },
        });
        // create a new trigger
        console.log("Creating a new Trigger");
    }));
    res.json({
        status: 'success',
        message: "Successfully created a new ZapRun",
    });
    // push it on to a queue
}));
app.listen(3001, () => {
    console.log('listening on port 3001');
});
