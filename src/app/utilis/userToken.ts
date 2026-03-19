import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import { IsActive, IUser } from "../modules/user/user.interface";
import { generateToken, verifyToken } from "./jwt";
import appError from "../errorHelpers/appError";
import httpStatus from 'http-status-codes';
import { User } from "../modules/user/user.model";

export const createUserToken = async(user : Partial<IUser>) => {
    const jwtPayload = {
        email: user.email,
        userId: user._id,
        role: user.role,
      };
    
      const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,String(envVars.JWT_ACCESS_EXPIRES));
      const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,String(envVars.JWT_REFRESH_EXPIRES));

      return {
        accessToken,
        refreshToken
      }
};

export const createNewAccessTokenWithRefreshToken =async (refreshToken : string) => {
const verifiedToken = verifyToken(refreshToken, envVars.JWT_REFRESH_SECRET) as JwtPayload;

  const isUserExists = await User.findOne({ email : verifiedToken.email });

  if (!isUserExists) {
    throw new appError(httpStatus.BAD_REQUEST, "User Does not Exits");
  }

  if (isUserExists.isActive === IsActive.BLOCKED) {
    throw new appError(httpStatus.BAD_REQUEST, "User is Blocked");
  }
  if (isUserExists.isDeleted) {
    throw new appError(httpStatus.BAD_REQUEST, "User is Deleted");
  };


  const jwtPayload = {
    email: isUserExists.email,
    userId: isUserExists._id,
    role: isUserExists.role,
  };

  const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRES);

  return accessToken
}