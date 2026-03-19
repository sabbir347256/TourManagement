import bcrypt from "bcryptjs";
import appError from "../../errorHelpers/appError";
import { IsAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import bcryptjs from 'bcryptjs';
import { envVars } from "../../config/env";

const createUser = async (payload: Partial<IUser>) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new appError(httpStatus.BAD_REQUEST, "User Allready Exist");
  }

  const hashedPassword = await bcrypt.hash(password as string, 10);

  //   const isPasswordMatch = await bcrypt.compare(password as string,hashedPassword);

  const authProvider: IsAuthProvider = {
    provider: "credentials",
    providerID: email as string,
  };

  const user = await User.create({
    email,
    auths: [authProvider],
    password: hashedPassword,
    ...rest,
  });
  return user;
};

const updateUser = async (userID: string,payload: Partial<IUser>,decodedToken: JwtPayload) => {

  const isUserExist = await User.findById(userID);

  if(!isUserExist){
    throw new appError(httpStatus.NOT_FOUND, 'User not found')
  }



  if (payload.role) {
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
      throw new appError(httpStatus.BAD_REQUEST, 'You are not authorized');
    }

    if (payload.role === Role.SUPER_ADMIN && decodedToken.role === Role.ADMIN) {
      throw new appError(httpStatus.FORBIDDEN, "You are not authorized");
    }
  }

  if(payload.isActive || payload.isDeleted || payload.isVerified){
    if(decodedToken.role === Role.USER || decodedToken.role === Role.GUIDE){
      throw new appError(httpStatus.FORBIDDEN,'you are not authorized');
    }
  }

  if(payload.password){
    payload.password = await bcryptjs.hash(payload.password,Number(envVars.BCRYPT_SALT_ROUND));
  }

  const newUpdateUser = await User.findByIdAndUpdate(userID, payload, {new : true, runValidators : true})

  return newUpdateUser;


};

const getAllUsers = async () => {
  const users = await User.find({});

  const totalUsers = await User.countDocuments();

  return {
    data: users,
    meta: {
      total: totalUsers,
    },
  };
};

export const userService = {
  createUser,
  getAllUsers,
  updateUser
};
