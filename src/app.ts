import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "./app/config";
import routes from "./app/routes";
import { globalErrorHandler } from "./app/middlewares/error.middleware";
import { notFound } from "./app/middlewares/notFound.middleware";

const app = express();

// parsers
app.use(express.json());
app.use(cookieParser());
app.use(cors(config.cors));

// application routes
app.use("/", routes);

const test = (req: Request, res: Response) => {
    res.json({ message: "Bistro Boss Server is running" });
};

// test route
app.get("/", test);

// Not found route
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

export default app;
