import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { TableServices } from "./table.service";

const createTable = catchAsync(async (req: Request, res: Response) => {
    const table = req.body;
    const result = await TableServices.createTable(table);
    res.send(result);
});

const updateTable = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = req.body;
    const result = await TableServices.updateTable(id, data);
    res.send(result);
});

const deleteTable = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TableServices.deleteTable(id);
    res.send(result);
});

const getAllTables = catchAsync(async (_req: Request, res: Response) => {
    const result = await TableServices.getAllTables();
    res.send(result);
});

const getTableById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await TableServices.getTableById(id);
    res.send(result);
});

export const TableControllers = {
    createTable,
    updateTable,
    deleteTable,
    getAllTables,
    getTableById,
};
