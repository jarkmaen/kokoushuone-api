import cors from "cors";
import express from "express";

import * as middleware from "./utils/middleware.js";
import reservationsRouter from "./routes/reservations.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/", reservationsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;
