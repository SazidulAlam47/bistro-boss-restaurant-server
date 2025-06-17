import { Request, Response } from "express";
import { CartService } from "./cart.service";
import catchAsync from "../../utils/catchAsync";

const addToCart = catchAsync(async (req: Request, res: Response) => {
    const cart = req.body;
    const result = await CartService.addToCart(cart);
    res.send(result);
});

const getUserCart = catchAsync(async (req: Request, res: Response) => {
    const email = req.params?.email;
    if (email !== req.user?.email) {
        return res.status(403).send({ message: "Forbidden" });
    }
    const result = await CartService.getUserCart(email);
    res.send(result);
});

const getAllCarts = catchAsync(async (req: Request, res: Response) => {
    const result = await CartService.getAllCarts();
    res.send(result);
});

const deleteCartItem = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await CartService.deleteCartItem(id);
    res.send(result);
});

const deleteUserCart = catchAsync(async (req: Request, res: Response) => {
    const email = req.query?.email as string;
    const result = await CartService.deleteUserCart(email);
    res.send(result);
});

export const CartController = {
    addToCart,
    getUserCart,
    getAllCarts,
    deleteCartItem,
    deleteUserCart,
};
