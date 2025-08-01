"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("./router/user");
const zap_1 = require("./router/zap");
const cors_1 = __importDefault(require("cors"));
const Trigure_1 = require("./router/Trigure");
const action_1 = require("./router/action");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
console.log("Check pass - 00");
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/zap", zap_1.zapRouter);
app.use("/api/v1/zap", Trigure_1.TriggerRouter);
app.use("/api/v1/zap", action_1.actionRouter);
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});
