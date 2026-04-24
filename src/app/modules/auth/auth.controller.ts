import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import { config } from "../../config";

const generateToken = catchAsync(async (req: Request, res: Response) => {
    const user = req.body;
    const token = AuthService.generateToken(user);

    const isProduction = config.NODE_ENV === "production";

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
    }).send({ success: true });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    const isProduction = config.NODE_ENV === "production";

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "strict",
    }).send({ success: true });
});

export const AuthController = {
    generateToken,
    logout,
};
