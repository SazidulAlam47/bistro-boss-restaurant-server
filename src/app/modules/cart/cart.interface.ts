export interface ICart {
    _id?: string;
    menuId: string;
    name: string;
    image: string;
    price: number;
    userEmail: string;
    createdAt?: Date;
    updatedAt?: Date;
}
