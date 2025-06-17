import { z } from "zod";

const createReservation = z.object({
    tableId: z.string(),
    reservationDate: z.string(), // ISO date string
    durationMinutes: z.number(),
    numberOfGuests: z.number(),
});

export const ReservationValidations = {
    createReservation,
};
