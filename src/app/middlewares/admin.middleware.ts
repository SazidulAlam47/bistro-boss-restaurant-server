import userCollection from "../modules/user/user.model";
import { Request, Response, NextFunction } from "express";

export const verifyAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const email = req.user?.email;
    const query = { email: email };
    const user = await userCollection.findOne(query);
    const isAdmin = user?.role === "admin";
    console.log({ isAdmin: isAdmin });
    console.log("check email", email);

    if (!isAdmin) {
        return res.status(403).send({ message: "Forbidden" });
    }
    next();
};
