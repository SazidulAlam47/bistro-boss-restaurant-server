import { Filter, ObjectId } from "mongodb";
import menusCollection from "./menu.model";
import { IMenu } from "./menu.interface";

const getAllMenus = async (
    filter: Filter<IMenu>,
    page: number | undefined,
    size: number | undefined
) => {
    let skip = 0;
    if (page && size) {
        skip = page * size;
    }

    const result = await menusCollection
        .find(filter)
        .skip(skip)
        .limit(size || Infinity)
        .toArray();
    return result;
};

const getMenuById = async (id: string) => {
    const query = { _id: new ObjectId(id) };
    const result = await menusCollection.findOne(query);
    return result;
};

const getMenusCount = async (filter: any = {}) => {
    const count = await menusCollection.countDocuments(filter);
    return count;
};

const createMenu = async (menu: IMenu) => {
    const result = await menusCollection.insertOne(menu);
    return result;
};

const updateMenu = async (id: string, menu: Partial<IMenu>) => {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            name: menu.name,
            recipe: menu.recipe,
            category: menu.category,
            price: parseFloat(menu.price?.toString() || "0"),
        },
    };
    const result = await menusCollection.updateOne(filter, updateDoc);
    return result;
};

const updateMenuImage = async (id: string, image: string) => {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            image: image,
        },
    };
    const result = await menusCollection.updateOne(filter, updateDoc);
    return result;
};

const deleteMenu = async (id: string) => {
    const query = { _id: new ObjectId(id) };
    const result = await menusCollection.deleteOne(query);
    return result;
};

export const MenuService = {
    getAllMenus,
    getMenuById,
    getMenusCount,
    createMenu,
    updateMenu,
    updateMenuImage,
    deleteMenu,
};
