import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRouter } from "../modules/auth/auth.route";

export const router = Router();

const moduleRoutes = [
    {
        path: '/user',
        router : UserRoutes
    },
    {
        path: '/auth',
        router: AuthRouter
    }
];

moduleRoutes.forEach((route) => {
    router.use(route.path, route.router)
});


