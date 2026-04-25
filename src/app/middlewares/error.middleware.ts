/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { config } from "../config";
import { ErrorRequestHandler } from "express";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    let statusCode: number = err?.statusCode || 500;
    let message: string = err?.message || "Something went wrong";
    let error = err;

    res.status(statusCode).json({
        message,
        error,
        stack: config.NODE_ENV === "development" ? err?.stack : undefined,
    });
};

export default globalErrorHandler;
