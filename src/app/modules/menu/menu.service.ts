import { Filter, ObjectId } from "mongodb";
import menusCollection from "./menu.model";
import { IMenu } from "./menu.interface";

const getAllMenus = async (
    filter: Filter<IMenu>,
    page: number | undefined,
    size: number | undefined,
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

const getRecommendedMenus = async () => {
    const result = await menusCollection
        .find({ isRecommended: true })
        .toArray();
    return result;
};

const getOfferedMenus = async () => {
    const result = await menusCollection.find({ isOffered: true }).toArray();
    return result;
};

const getPopularMenus = async () => {
    const result = await menusCollection.find({ isPopular: true }).toArray();
    return result;
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
            isRecommended: Boolean(menu.isRecommended),
            isOffered: Boolean(menu.isOffered),
            isPopular: Boolean(menu.isPopular),
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
    getRecommendedMenus,
    getOfferedMenus,
    getPopularMenus,
    createMenu,
    updateMenu,
    updateMenuImage,
    deleteMenu,
};
