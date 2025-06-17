import { Router } from "express";
import { MenuController } from "./menu.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";
import { MenuValidations } from "./menu.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = Router();

// Public routes
router.get("/", MenuController.getAllMenus);
router.get("/count", MenuController.getMenusCount);
router.get("/:id", MenuController.getMenuById);

// Protected routes
router.post(
    "/",
    validateRequest(MenuValidations.createMenu),
    verifyToken,
    verifyAdmin,
    MenuController.createMenu
);
router.patch("/:id", verifyToken, verifyAdmin, MenuController.updateMenu);
router.patch(
    "/image/:id",
    verifyToken,
    verifyAdmin,
    MenuController.updateMenuImage
);
router.delete("/:id", verifyToken, verifyAdmin, MenuController.deleteMenu);

export default router;
