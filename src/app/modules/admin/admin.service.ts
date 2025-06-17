import { IAdminStats, IOrderStatus } from "./admin.interface";
import userCollection from "../user/user.model";
import menuCollection from "../menu/menu.model";
import paymentCollection from "../payment/payment.model";

const getAdminStats = async (): Promise<IAdminStats> => {
    const customers = await userCollection.estimatedDocumentCount();
    const products = await menuCollection.estimatedDocumentCount();
    const orders = await paymentCollection.estimatedDocumentCount();

    const result = await paymentCollection
        .aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$price",
                    },
                },
            },
        ])
        .toArray();

    const revenue = result.length > 0 ? result[0].totalRevenue : 0;

    return { customers, products, orders, revenue };
};

const getOrderStatus = async (): Promise<IOrderStatus[]> => {
    const result = (await paymentCollection
        .aggregate([
            {
                $unwind: "$menuItemIds",
            },
            {
                $addFields: {
                    menuItemIds: {
                        $toObjectId: "$menuItemIds",
                    },
                },
            },
            {
                $lookup: {
                    from: "menu",
                    localField: "menuItemIds",
                    foreignField: "_id",
                    as: "menuItems",
                },
            },
            {
                $unwind: "$menuItems",
            },
            {
                $group: {
                    _id: "$menuItems.category",
                    quantity: { $sum: 1 },
                    revenue: { $sum: "$menuItems.price" },
                },
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    quantity: 1,
                    revenue: 1,
                },
            },
        ])
        .toArray()) as IOrderStatus[];

    return result;
};

export const AdminService = {
    getAdminStats,
    getOrderStatus,
};
