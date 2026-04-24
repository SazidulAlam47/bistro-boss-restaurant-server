import { config } from "../config";
import { MongoClient } from "mongodb";
import dns from "dns";

const dnsServers =
	config.database.dnsServers.length > 0
		? config.database.dnsServers
		: ["8.8.8.8", "1.1.1.1"];

dns.setServers(dnsServers);

const client = new MongoClient(config.database.uri, config.database.options);
const database = client.db("BistroDB");

export default database;
