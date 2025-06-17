import { Collection } from "mongodb";
import database from "../../utils/mongoDatabase";
import { ITable } from "./table.interface";

const tableCollection: Collection<ITable> = database.collection("table");

export default tableCollection;
