import catchAsync from "../../utils/catchAsync";
import { Request, Response } from "express";
import { ReservationService } from "./reservation.service";

const createReservation = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const reservation = req.body;
    const result = await ReservationService.createReservation(
        reservation,
        user
    );
    res.send(result);
});

const getAllReservations = catchAsync(async (_req: Request, res: Response) => {
    const result = await ReservationService.getAllReservations();
    res.send(result);
});

const getMyReservations = catchAsync(async (req: Request, res: Response) => {
    const user = req.user!;
    const result = await ReservationService.getReservationsByEmail(user.email);
    res.send(result);
});

export const ReservationController = {
    createReservation,
    getAllReservations,
    getMyReservations,
};
