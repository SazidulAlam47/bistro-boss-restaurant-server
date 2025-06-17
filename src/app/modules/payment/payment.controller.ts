import { Request, Response } from "express";
import { PaymentService } from "./payment.service";
import stripe from "../../config/stripe";
import catchAsync from "../../utils/catchAsync";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
    const { price } = req.body;
    const amount = Math.round(price * 100).toString();
    const paymentIntent = await stripe.paymentIntents.create({
        amount: parseInt(amount),
        currency: "usd",
        payment_method_types: ["card"],
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const payment = req.body;
    const result = await PaymentService.createPayment(payment);
    res.send(result);
});

const getPaymentsByEmail = catchAsync(async (req: Request, res: Response) => {
    const email = req.params.email;
    if (req.user?.email !== email) {
        return res.status(403).send({ message: "Forbidden" });
    }
    const result = await PaymentService.getPaymentsByEmail(email);
    res.send(result);
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getAllPayments();
    res.send(result);
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await PaymentService.getPaymentById(id);
    res.send(result);
});

const getOrderItems = catchAsync(async (req: Request, res: Response) => {
    const orderId = req.params.orderId;
    const result = await PaymentService.getOrderItems(orderId);
    res.send(result);
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id;
    const { status } = req.body;
    const result = await PaymentService.updatePaymentStatus(id, status);
    res.send(result);
});

const getPaymentStats = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentService.getPaymentStats();
    res.send(result);
});

export const PaymentController = {
    createPaymentIntent,
    createPayment,
    getPaymentsByEmail,
    getAllPayments,
    getPaymentById,
    getOrderItems,
    updatePaymentStatus,
    getPaymentStats,
};
