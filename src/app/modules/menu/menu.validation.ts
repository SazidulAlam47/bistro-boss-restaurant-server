import { z } from "zod";

const createMenu = z.object({
    name: z.string(),
    recipe: z.string(),
    image: z.string(),
    category: z.string(),
    price: z.number(),
});

export const MenuValidations = {
    createMenu,
};
