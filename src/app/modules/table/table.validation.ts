import { z } from "zod";

const createTable = z.object({
    tableNumber: z.string(),
    seats: z.number(),
    location: z.enum(["indoor", "patio", "balcony"]).optional(),
});

export const TableValidations = {
    createTable,
};
