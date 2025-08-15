
import express from "express";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import cors from "cors"
import { TriggerRouter } from "./router/Trigure";
import { actionRouter } from "./router/action";


const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/zap", TriggerRouter);
app.use("/api/v1/zap", actionRouter);


app.listen(4000, () => {
    console.log("Server is running on port 4000");
})