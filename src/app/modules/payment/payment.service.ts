import { ObjectId } from "mongodb";
import paymentCollection from "./payment.model";
import menuCollection from "../menu/menu.model";
import { IPayment } from "./payment.interface";

const createPayment = async (payment: IPayment) => {
    const result = await paymentCollection.insertOne(payment);
    return result;
};

const getPaymentsByEmail = async (email: string) => {
    const result = await paymentCollection
        .find({ email })
        .sort({ date: -1 })
        .toArray();
    return result;
};

const getAllPayments = async () => {
    const result = await paymentCollection.find().sort({ date: -1 }).toArray();
    return result;
};

const getPaymentById = async (id: string) => {
    const query = { _id: new ObjectId(id) } as any;
    const result = await paymentCollection.findOne(query);
    return result;
};

const getOrderItems = async (orderId: string) => {
    const query = { _id: new ObjectId(orderId) } as any;
    const payment = await paymentCollection.findOne(query);

    if (!payment) {
        return null;
    }

    // Get menu items using menuItemIds
    const menuItems = await menuCollection
        .find({
            _id: {
                $in: payment.menuItemIds.map((id) => new ObjectId(id)),
            } as any,
        })
        .toArray();

    return menuItems;
};

const updatePaymentStatus = async (
    id: string,
    status: "pending" | "completed" | "cancelled"
) => {
    const filter = { _id: new ObjectId(id) } as any;
    const updateDoc = {
        $set: {
            status: status,
        },
    };
    const result = await paymentCollection.updateOne(filter, updateDoc);
    return result;
};

const getPaymentStats = async () => {
    const result = await paymentCollection
        .aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$price" },
                    totalOrders: { $sum: 1 },
                },
            },
        ])
        .toArray();
    return result[0] || { totalRevenue: 0, totalOrders: 0 };
};

export const PaymentService = {
    createPayment,
    getPaymentsByEmail,
    getAllPayments,
    getPaymentById,
    getOrderItems,
    updatePaymentStatus,
    getPaymentStats,
};
