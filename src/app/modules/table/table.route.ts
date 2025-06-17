import { Router } from "express";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";
import { TableControllers } from "./table.controller";
import validateRequest from "../../middlewares/validateRequest";
import { TableValidations } from "./table.validation";

const router = Router();

// Public routes
router.get("/", TableControllers.getAllTables);
router.get("/:id", TableControllers.getTableById);

// Protected routes
router.post(
    "/",
    validateRequest(TableValidations.createTable),
    verifyToken,
    verifyAdmin,
    TableControllers.createTable
);
router.patch("/:id", verifyToken, verifyAdmin, TableControllers.updateTable);
router.delete("/:id", verifyToken, verifyAdmin, TableControllers.deleteTable);

export default router;
