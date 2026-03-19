import { NextFunction, Request, Response } from "express";
import { catchAsyn } from "../../utilis/catchAsyn";
import { sendResponse } from "../../utilis/sendResponse";
import httpStatus from "http-status-codes";
import { authServices } from "./auth.services";
import { setAuthCookies } from "../../utilis/setCookies";
import { JwtPayload } from "jsonwebtoken";
import { createUserToken } from "../../utilis/userToken";
import appError from "../../errorHelpers/appError";
import { IUser } from "../user/user.interface";
import { envVars } from "../../config/env";
import passport from "passport";

const credentialLogin = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    // const loginInfo = await authServices.credentialLogin(req.body);

    passport.authenticate("local", async (err:any, user:any, info:any) => {
      if(err){
        return next(new appError(401,err));
      }

      if(!user){
        return next(new appError(401, info.message))
      }

      const userTokens =await createUserToken(user);

      const {password : pass, ...rest} = user.toObject();

      setAuthCookies(res, userTokens);

      sendResponse(res, {
        statusCode: httpStatus.CREATED,
        message: "User Login Successfully",
        success: true,
        data: {
          accessToken : userTokens.accessToken,
          refreshToken : userTokens.refreshToken,
          user : rest 
        },
      });
    })(req, res, next);
  },
);

const getNewAccessToken = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    console.log(refreshToken);

    const tokenInfo = await authServices.getNewAccessTokenServices(
      refreshToken as string,
    );

    res.cookie("accessToken", tokenInfo.accessToken, {
      httpOnly: true,
      secure: false,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "New Access Token Generated Successfully",
      success: true,
      data: tokenInfo,
    });
  },
);

const logout = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "User Logout Successfully",
      success: true,
      data: null,
    });
  },
);

const resetPassword = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    const decodedToken = req.user;

    await authServices.resetPassword(
      oldPassword,
      newPassword,
      decodedToken as JwtPayload,
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      message: "Password Chnage Successfully",
      success: true,
      data: null,
    });
  },
);

const googleCallBackController = catchAsyn(
  async (req: Request, res: Response, next: NextFunction) => {
    let redirectTo = req.query.state ? (req.query.state as string) : "";

    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const user = req.user as IUser;

    if (!user) {
      throw new appError(httpStatus.NOT_FOUND, "User Not Found");
    }

    const tokenInfo = await createUserToken(user);

    setAuthCookies(res, tokenInfo);

    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  },
);

export const AuthController = {
  credentialLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallBackController,
};
