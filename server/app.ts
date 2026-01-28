import * as logger from "./utils/logger.js";
import express from "express";
import reservationsRouter from "./routes/reservations.js";

const app = express();
app.use(express.json());

app.use("/", reservationsRouter);

app.use((err: any, req: any, res: any, next: any) => {
    logger.error(err);
    res.status(500).json({ error: "internal server error" });
});

export default app;
