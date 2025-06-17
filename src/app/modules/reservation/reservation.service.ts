import ApiError from "../../errors/ApiError";
import { Reservation } from "./reservation.interface";
import { reservationCollection } from "./reservation.model";
import tableCollection from "../table/table.model";
import { ObjectId } from "mongodb";
import { IDecodedUser } from "../auth/auth.interface";
import userCollection from "../user/user.model";

const createReservation = async (
    reservation: Omit<Reservation, "id">,
    decodedUser: IDecodedUser
) => {
    const reservationDate = new Date(reservation.reservationDate);
    const duration = reservation.durationMinutes;
    const reservationEnd = new Date(
        reservationDate.getTime() + duration * 60000
    );

    const user = await userCollection.findOne({ email: decodedUser.email });
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    reservation.customerEmail = user.email;
    reservation.customerName = user.name;

    const table = await tableCollection.findOne({
        _id: new ObjectId(reservation.tableId),
    });
    if (!table) {
        throw new ApiError(404, "Table not found.");
    }

    const possibleConflicts = await reservationCollection
        .find({
            tableId: reservation.tableId,
            reservationDate: { $lt: reservationEnd },
        })
        .toArray();

    const hasConflict = possibleConflicts.some((r) => {
        const rEnd =
            new Date(r.reservationDate).getTime() + r.durationMinutes * 60000;
        return rEnd > reservationDate.getTime();
    });
    if (hasConflict) {
        throw new ApiError(
            409,
            "Table is already booked for the selected time range."
        );
    }
    const doc = {
        ...reservation,
        reservationDate: reservationDate,
    };
    const result = await reservationCollection.insertOne(doc);
    return result;
};

const getAllReservations = async () => {
    return reservationCollection.find().toArray();
};

const getReservationsByEmail = async (email: string) => {
    return reservationCollection.find({ customerEmail: email }).toArray();
};

export const ReservationService = {
    createReservation,
    getAllReservations,
    getReservationsByEmail,
};
