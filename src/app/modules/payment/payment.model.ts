import { Collection } from "mongodb";
import { IPayment } from "./payment.interface";
import database from "../../utils/mongoDatabase";

const paymentCollection: Collection<IPayment> = database.collection("payments");

export default paymentCollection;
