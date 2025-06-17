import { ObjectId } from "mongodb";

export interface Reservation {
    id: string | ObjectId;
    customerName: string;
    customerEmail: string;
    tableId: string;
    reservationTime: Date;
    durationMinutes: number;
    numberOfGuests: number;
    status: "pending" | "confirmed" | "cancelled";
}
