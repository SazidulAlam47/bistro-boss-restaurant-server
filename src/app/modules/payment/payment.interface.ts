import { ObjectId } from "mongodb";

export interface IPayment {
    _id?: string | ObjectId;
    price: number;
    email: string;
    transactionId: string;
    date: string;
    status: "pending" | "completed" | "cancelled";
    menuItems: string[];
    menuItemIds: string[];
}
