import { ObjectId } from "mongodb";

export interface ITable {
    _id: string | ObjectId;
    tableNumber: string;
    seats: number;
    location: "indoor" | "patio" | "balcony";
}
