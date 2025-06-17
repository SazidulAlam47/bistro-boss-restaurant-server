import { Router } from "express";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/jwt", AuthController.generateToken);
router.get("/logout", AuthController.logout);

export default router;
