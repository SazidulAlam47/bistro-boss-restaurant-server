import { ObjectId } from "mongodb";
import userCollection from "./user.model";
import { IUser } from "./user.interface";

const getAllUsers = async () => {
    const result = await userCollection.find().toArray();
    return result;
};

const createOrUpdateUser = async (user: IUser) => {
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = {
        $set: {
            name: user.name,
            email: user.email,
            image: user.image,
        },
    };
    const result = await userCollection.updateOne(filter, updateDoc, options);
    return result;
};

const updateUserRole = async (id: string, role: "user" | "admin") => {
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            role: role,
        },
    };
    const result = await userCollection.updateOne(filter, updateDoc);
    return result;
};

const checkAdmin = async (email: string) => {
    const query = { email: email };
    const user = await userCollection.findOne(query);
    return user?.role === "admin";
};

const deleteUser = async (id: string) => {
    const query = { _id: new ObjectId(id) };
    const result = await userCollection.deleteOne(query);
    return result;
};

export const UserService = {
    getAllUsers,
    createOrUpdateUser,
    updateUserRole,
    checkAdmin,
    deleteUser,
};
