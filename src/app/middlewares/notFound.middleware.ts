import { Request, Response, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(404).json({
        message: "API not found",
        error: {
            path: req.originalUrl,
        },
    });
};
