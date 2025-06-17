import { Router } from "express";
import { ReservationController } from "./reservation.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ReservationValidations } from "./reservation.validation";
import { verifyToken } from "../../middlewares/auth.middleware";
import { verifyAdmin } from "../../middlewares/admin.middleware";

const router = Router();

router.post(
    "/",
    validateRequest(ReservationValidations.createReservation),
    verifyToken,
    ReservationController.createReservation
);

router.get(
    "/",
    verifyToken,
    verifyAdmin,
    ReservationController.getAllReservations
);

router.get("/me", verifyToken, ReservationController.getMyReservations);

export const ReservationRoutes = router;
