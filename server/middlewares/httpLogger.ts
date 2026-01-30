import * as logger from "../utils/logger.js";
import { NextFunction, Request, Response } from "express";

/**
 * Middleware: Kirjaa saapuvien HTTP-pyyntöjen perustiedot konsoliin.
 */
export const httpLogger = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    logger.info("Method:", req.method);
    logger.info("Path:  ", req.path);
    logger.info("Body:  ", req.body);
    logger.info("---");
    next();
};
