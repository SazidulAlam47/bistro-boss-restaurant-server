import { Router } from "express";
import { CartController } from "./cart.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// Protected routes
router.post("/", verifyToken, CartController.addToCart);
router.get("/:email", verifyToken, CartController.getUserCart);
router.get("/", verifyToken, verifyAdmin, CartController.getAllCarts);
router.delete("/:id", verifyToken, CartController.deleteCartItem);
router.delete("/", verifyToken, CartController.deleteUserCart);

export default router;
