export interface IUser {
    _id?: string;
    name: string;
    email: string;
    image?: string;
    role?: "user" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}
