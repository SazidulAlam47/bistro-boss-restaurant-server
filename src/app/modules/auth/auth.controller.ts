import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import catchAsync from "../../utils/catchAsync";
import { config } from "../../config";

const generateToken = catchAsync(async (req: Request, res: Response) => {
    const user = req.body;
    const token = AuthService.generateToken(user);
    res.cookie("token", token, {
        httpOnly: true,
        secure: config.NODE_ENV === "production",
        sameSite: config.NODE_ENV === "production" ? "none" : "strict",
    }).send({ success: true });
});

const logout = catchAsync(async (req: Request, res: Response) => {
    res.clearCookie("token").send({ success: true });
});

export const AuthController = {
    generateToken,
    logout,
};
