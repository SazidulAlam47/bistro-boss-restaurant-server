import { Request, Response } from "express";
import { MenuService } from "./menu.service";
import catchAsync from "../../utils/catchAsync";

const getAllMenus = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query?.page as string);
    const size = parseInt(req.query?.size as string);
    const category = req.query?.category as string;

    let filter = {};
    if (category) {
        filter = { category };
    }

    const result = await MenuService.getAllMenus(filter, page, size);
    res.send(result);
});

const getMenuById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await MenuService.getMenuById(id);
    res.send(result);
});

const getMenusCount = catchAsync(async (req: Request, res: Response) => {
    const category = req.query?.category as string;
    let filter = {};
    if (category) {
        filter = { category };
    }
    const count = await MenuService.getMenusCount(filter);
    res.send({ count });
});

const createMenu = catchAsync(async (req: Request, res: Response) => {
    const menu = req.body;
    const result = await MenuService.createMenu(menu);
    res.send(result);
});

const updateMenu = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const menu = req.body;
    const result = await MenuService.updateMenu(id, menu);
    res.send(result);
});

const updateMenuImage = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { image } = req.body;
    const result = await MenuService.updateMenuImage(id, image);
    res.send(result);
});

const deleteMenu = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await MenuService.deleteMenu(id);
    res.send(result);
});

export const MenuController = {
    getAllMenus,
    getMenuById,
    getMenusCount,
    createMenu,
    updateMenu,
    updateMenuImage,
    deleteMenu,
};
