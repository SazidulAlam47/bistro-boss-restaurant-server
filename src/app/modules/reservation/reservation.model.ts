import { Collection } from "mongodb";
import database from "../../utils/mongoDatabase";
import { Reservation } from "./reservation.interface";

export const reservationCollection: Collection<Reservation> =
    database.collection("reservation");
