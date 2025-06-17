import { ObjectId } from "mongodb";

export interface Reservation {
    _id: string | ObjectId;
    customerName: string;
    customerEmail: string;
    tableId: string;
    reservationDate: Date;
    durationMinutes: number;
    numberOfGuests: number;
}
