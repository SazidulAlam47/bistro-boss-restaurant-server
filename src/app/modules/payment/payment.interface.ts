import { ObjectId } from "mongodb";

export interface IPayment {
    _id?: string | ObjectId;
    tnxId: string;
    price: number;
    email: string;
    name: string;
    date: Date;
    menuItemIds: string[] | string;
    status: "pending" | "completed" | "cancelled";
}
