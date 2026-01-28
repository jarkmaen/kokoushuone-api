import cors from "cors";
import express from "express";

import reservationsRouter from "./routes/reservations.js";
import { errorHandler, unknownEndpoint } from "./middlewares/errors.js";
import { httpLogger } from "./middlewares/httpLogger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(httpLogger);

app.use("/api/reservations", reservationsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
