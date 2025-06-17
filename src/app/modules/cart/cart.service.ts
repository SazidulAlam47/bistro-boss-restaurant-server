import { ObjectId } from "mongodb";
import cartsCollection from "./cart.model";
import { ICart } from "./cart.interface";

const addToCart = async (cart: ICart) => {
    const result = await cartsCollection.insertOne(cart);
    return result;
};

const getUserCart = async (email: string) => {
    const options = { userEmail: email };
    const result = await cartsCollection.find(options).toArray();
    return result;
};

const getAllCarts = async () => {
    const result = await cartsCollection.find().toArray();
    return result;
};

const deleteCartItem = async (id: string) => {
    const query = { _id: new ObjectId(id) };
    const result = await cartsCollection.deleteOne(query);
    return result;
};

const deleteUserCart = async (email: string) => {
    const query = { userEmail: email };
    const result = await cartsCollection.deleteMany(query);
    return result;
};

export const CartService = {
    addToCart,
    getUserCart,
    getAllCarts,
    deleteCartItem,
    deleteUserCart,
};
