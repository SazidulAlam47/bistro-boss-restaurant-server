import { z } from "zod";

const createPayment = z.object({
    price: z.number(),
    email: z.string().email(),
    transactionId: z.string(),
    date: z.string(),
    status: z.enum(["pending", "completed", "cancelled"]),
    menuItems: z.array(z.string()),
    menuItemIds: z.array(z.string()),
});

export const PaymentValidations = {
    createPayment,
};
