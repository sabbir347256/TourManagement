import { NextFunction, Request, Response } from "express";
import appError from "../errorHelpers/appError";
import { verifyToken } from "../utilis/jwt";
import { envVars } from "../config/env";
import { Role } from "../modules/user/user.interface";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authValidation =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken = req.headers.authorization;

    if (!accessToken) {
      throw new appError(403, "No token Recieved");
    }

    const verifyedToken = verifyToken(
      accessToken,
      envVars.JWT_ACCESS_SECRET,
    ) as JwtPayload;

    if (!authRoles.includes(verifyedToken.role)) {
      throw new appError(403, "You are not permitted to view this route");
    }
    req.user = verifyedToken;
    next();
  };
