import { ObjectId } from "mongodb";

export interface IUser {
    _id?: string | ObjectId;
    name: string;
    email: string;
    image?: string;
    role?: "user" | "admin";
}
