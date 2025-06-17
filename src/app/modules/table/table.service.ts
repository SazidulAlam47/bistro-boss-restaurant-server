import { ITable } from "./table.interface";
import tableCollection from "./table.model";
import { ObjectId } from "mongodb";

const createTable = async (table: ITable) => {
    const result = await tableCollection.insertOne(table);
    return result;
};

const updateTable = async (id: string, data: Partial<ITable>) => {
    const result = await tableCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data }
    );
    return result;
};

const deleteTable = async (id: string) => {
    const result = await tableCollection.deleteOne({ _id: new ObjectId(id) });
    return result;
};

const getAllTables = async () => {
    const tables = await tableCollection.find().toArray();
    return tables;
};

const getTableById = async (id: string) => {
    const table = await tableCollection.findOne({ _id: new ObjectId(id) });
    return table;
};

export const TableServices = {
    createTable,
    updateTable,
    deleteTable,
    getAllTables,
    getTableById,
};
