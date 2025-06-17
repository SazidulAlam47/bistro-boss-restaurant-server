import jwt from "jsonwebtoken";
import { config } from "../../config";
import { IDecodedUser } from "./auth.interface";

const generateToken = (user: IDecodedUser): string => {
    return jwt.sign(user, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
    });
};

export const AuthService = {
    generateToken,
};
