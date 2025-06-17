import { Collection } from "mongodb";
import { IUser } from "./user.interface";
import database from "../../utils/mongoDatabase";

const userCollection: Collection<IUser> = database.collection("users");

export default userCollection;
