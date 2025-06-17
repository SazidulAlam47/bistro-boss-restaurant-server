import jwt from "jsonwebtoken";
import { config } from "../../config";
import { IUser } from "./auth.interface";

const generateToken = (user: IUser): string => {
    return jwt.sign(user, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

export const AuthService = {
    generateToken,
};
