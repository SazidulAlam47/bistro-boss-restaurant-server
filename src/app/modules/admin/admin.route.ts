import { Router } from "express";
import { AdminController } from "./admin.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// Protected admin routes
router.get("/", verifyToken, verifyAdmin, AdminController.getAdminStats);
router.get(
    "/order-status",
    verifyToken,
    verifyAdmin,
    AdminController.getOrderStatus
);

export default router;
