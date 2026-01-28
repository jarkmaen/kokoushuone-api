import * as logger from "../utils/logger.js";
import { NextFunction, Request, Response } from "express";

export const errorHandler = (
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

export const unknownEndpoint = (_req: Request, res: Response) => {
    res.status(404).json({ error: "Unknown endpoint" });
};
