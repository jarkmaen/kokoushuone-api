import { NextFunction, Request, Response } from "express";

import * as logger from "./logger.js";

const errorHandler = (
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(error.message);

    if (res.headersSent) {
        return next(error);
    }

    if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: "Internal server error" });
};

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
    logger.info("Method:", req.method);
    logger.info("Path:  ", req.path);
    logger.info("Body:  ", req.body);
    logger.info("---");
    next();
};

const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(404).json({ error: "Unknown endpoint" });
};

export { errorHandler, requestLogger, unknownEndpoint };
