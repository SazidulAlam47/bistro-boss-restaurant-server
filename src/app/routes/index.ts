import { Router } from "express";
import menuRoutes from "../modules/menu/menu.route";
import cartRoutes from "../modules/cart/cart.route";
import userRoutes from "../modules/user/user.route";
import paymentRoutes from "../modules/payment/payment.route";
import adminRoutes from "../modules/admin/admin.route";
import authRoutes from "../modules/auth/auth.route";
import tableRoutes from "../modules/table/table.route";

const router = Router();

const moduleRoutes = [
    {
        path: "/menus",
        route: menuRoutes,
    },
    {
        path: "/carts",
        route: cartRoutes,
    },
    {
        path: "/users",
        route: userRoutes,
    },
    {
        path: "/payments",
        route: paymentRoutes,
    },
    {
        path: "/admin",
        route: adminRoutes,
    },
    {
        path: "/auth",
        route: authRoutes,
    },
    {
        path: "/tables",
        route: tableRoutes,
    },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
