export interface IAdminStats {
    customers: number;
    products: number;
    orders: number;
    revenue: number;
}

export interface IOrderStatus {
    category: string;
    quantity: number;
    revenue: number;
}
