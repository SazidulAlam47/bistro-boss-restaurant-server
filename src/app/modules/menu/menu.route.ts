import { Router } from "express";
import { MenuController } from "./menu.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

// Public routes
router.get("/", MenuController.getAllMenus);
router.get("/count", MenuController.getMenusCount);
router.get("/recommended", MenuController.getRecommendedMenus);
router.get("/offered", MenuController.getOfferedMenus);
router.get("/popular", MenuController.getPopularMenus);
router.get("/:id", MenuController.getMenuById);

// Protected routes
router.post("/", verifyToken, verifyAdmin, MenuController.createMenu);
router.patch("/:id", verifyToken, verifyAdmin, MenuController.updateMenu);
router.patch(
    "/image/:id",
    verifyToken,
    verifyAdmin,
    MenuController.updateMenuImage,
);
router.delete("/:id", verifyToken, verifyAdmin, MenuController.deleteMenu);

export default router;
