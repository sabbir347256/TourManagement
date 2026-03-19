import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";

import { createUserZodSchema } from "./user.validation";
import { validateRequest } from "../../middleware/validate";
import appError from "../../errorHelpers/appError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "./user.interface";
import { verifyToken } from "../../utilis/jwt";
import { envVars } from "../../config/env";
import { authValidation } from "../../middleware/authValidation";

const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  userController.createUser,
);
router.get("/all-users",authValidation(Role.ADMIN,Role.SUPER_ADMIN),userController.getAllUsers);
router.patch('/:id',authValidation(...Object.values(Role)), userController.updateUser);

export const UserRoutes = router;
