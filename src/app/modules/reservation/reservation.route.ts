import { Router } from "express";
import { ReservationController } from "./reservation.controller";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

router.post("/", verifyToken, ReservationController.createReservation);

router.get(
    "/",
    verifyToken,
    verifyAdmin,
    ReservationController.getAllReservations,
);

router.get("/me", verifyToken, ReservationController.getMyReservations);

export const ReservationRoutes = router;
