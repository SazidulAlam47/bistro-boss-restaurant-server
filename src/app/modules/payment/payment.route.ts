import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// Protected routes
router.post(
    "/create-payment-intent",
    verifyToken,
    PaymentController.createPaymentIntent
);
router.post("/", verifyToken, PaymentController.createPayment);
router.get("/email/:email", verifyToken, PaymentController.getPaymentsByEmail);
router.get("/", verifyToken, verifyAdmin, PaymentController.getAllPayments);
router.get("/:id", verifyToken, PaymentController.getPaymentById);
router.get(
    "/order-items/:orderId",
    verifyToken,
    PaymentController.getOrderItems
);
router.patch(
    "/orders/status/:id",
    verifyToken,
    verifyAdmin,
    PaymentController.updatePaymentStatus
);

export default router;
