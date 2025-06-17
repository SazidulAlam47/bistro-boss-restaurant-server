export interface IPayment {
    _id?: string;
    price: number;
    email: string;
    transactionId: string;
    date: string;
    status: "pending" | "completed" | "cancelled";
    menuItems: string[];
    menuItemIds: string[];
    createdAt?: string;
    updatedAt?: string;
}
