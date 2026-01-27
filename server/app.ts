import express from "express";
import reservationsRouter from "./routes/reservations";

const app = express();
app.use(express.json());

app.use("/", reservationsRouter);

app.use((err: any, req: any, res: any, next: any) => {
    console.error(err);
    res.status(500).json({ error: "internal server error" });
});

export default app;
