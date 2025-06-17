import { Collection } from "mongodb";
import { ICart } from "./cart.interface";
import database from "../../utils/mongoDatabase";

const cartsCollection: Collection<ICart> = database.collection("cart");

export default cartsCollection;
