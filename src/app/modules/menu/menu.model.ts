import { Collection } from "mongodb";
import { IMenu } from "./menu.interface";
import database from "../../utils/mongoDatabase";

const menusCollection: Collection<IMenu> = database.collection("menu");

export default menusCollection;
