import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { User } from "./user.model";
import { userService } from "./user.service";
import appError from "../../errorHelpers/appError";
import { catchAsyn } from "../../utilis/catchAsyn";
import { sendResponse } from "../../utilis/sendResponse";
import { verifyToken } from "../../utilis/jwt";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

// type AsynHandler = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => Promise<void>;

// const catchAsyn =
//   (fn: AsynHandler) => (req: Request, res: Response, next: NextFunction) => {
//     Promise.resolve(fn(req, res, next)).catch((err: any) => {
//       console.log(err);
//       next(err);
//     });
//   };

const createUser = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await userService.createUser(req.body);
    console.log(user)

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      success: true,
      data: user,
    });
  },
);

const updateUser = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const userID = req.params.id;
    const token = req.headers.authorization;
    const payload = req.body;
    const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload;
    const user = await userService.updateUser(userID as string,payload,verifiedToken);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Update Successfully",
      success: true,
      data: user,
    });
  },
);

const getAllUsers = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await userService.getAllUsers();

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      success: true,
      data: users.data,
      meta : users.meta
    });
  },
);

export const userController = {
  createUser,
  getAllUsers,
  updateUser
};
