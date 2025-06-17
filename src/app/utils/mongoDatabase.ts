import { config } from "../config";
import { MongoClient } from "mongodb";

const client = new MongoClient(config.database.uri, config.database.options);
const database = client.db("BistroDB");

export default database;
