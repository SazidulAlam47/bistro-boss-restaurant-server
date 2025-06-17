import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { IJwtPayload } from "../interfaces/jwt.interface";

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.cookies?.token;
    console.log("Verifying token", token);

    if (!token) {
        return res.status(401).send({ message: "Not authorized" });
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;
        req.user = decoded;
        console.log(decoded);
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send({ message: "Not authorized" });
    }
};
