import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import catchAsync from "../../utils/catchAsync";

const getAdminStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getAdminStats();
    res.send(result);
});

const getOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getOrderStatus();
    res.send(result);
});

export const AdminController = {
    getAdminStats,
    getOrderStatus,
};
