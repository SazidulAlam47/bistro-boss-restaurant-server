import { Request, Response } from "express";
import { UserService } from "./user.service";
import catchAsync from "../../utils/catchAsync";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getAllUsers();
    res.send(result);
});

const createOrUpdateUser = catchAsync(async (req: Request, res: Response) => {
    const user = req.body;
    const result = await UserService.createOrUpdateUser(user);
    res.send(result);
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { role } = req.body;
    const result = await UserService.updateUserRole(id, role);
    res.send(result);
});

const checkAdmin = catchAsync(async (req: Request, res: Response) => {
    const email = req.params.email;
    if (req.user?.email !== email) {
        return res.status(403).send({ message: "Forbidden" });
    }
    const isAdmin = await UserService.checkAdmin(email);
    res.send({ admin: isAdmin });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await UserService.deleteUser(id);
    res.send(result);
});

export const UserController = {
    getAllUsers,
    createOrUpdateUser,
    updateUserRole,
    checkAdmin,
    deleteUser,
};
