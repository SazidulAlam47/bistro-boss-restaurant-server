import { ObjectId } from "mongodb";

export interface ICart {
    _id?: string | ObjectId;
    menuId: string;
    name: string;
    image: string;
    price: number;
    userEmail: string;
}
