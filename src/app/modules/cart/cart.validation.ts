import { z } from "zod";

const addToCart = z.object({
    menuId: z.string(),
    name: z.string(),
    image: z.string(),
    price: z.number(),
    userEmail: z.string().email(),
});

export const CartValidations = {
    addToCart,
};
