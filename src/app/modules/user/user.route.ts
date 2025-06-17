import { Router } from "express";
import { UserController } from "./user.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// Protected routes
router.get("/", verifyToken, verifyAdmin, UserController.getAllUsers);
router.put("/", verifyToken, UserController.createOrUpdateUser);
router.patch(
    "/admin/:id",
    verifyToken,
    verifyAdmin,
    UserController.updateUserRole
);
router.get("/admin/:email", verifyToken, UserController.checkAdmin);
router.delete("/:id", verifyToken, verifyAdmin, UserController.deleteUser);

export default router;
