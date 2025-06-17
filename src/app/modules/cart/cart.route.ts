import { Router } from "express";
import { CartController } from "./cart.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { CartValidations } from "./cart.validation";

const router = Router();

// Protected routes
router.post(
    "/",
    validateRequest(CartValidations.addToCart),
    verifyToken,
    CartController.addToCart
);
router.get("/:email", verifyToken, CartController.getUserCart);
router.get("/", verifyToken, verifyAdmin, CartController.getAllCarts);
router.delete("/:id", verifyToken, CartController.deleteCartItem);
router.delete("/email/:email", verifyToken, CartController.deleteUserCart);

export default router;
