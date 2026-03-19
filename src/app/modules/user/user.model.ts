import { model, Schema } from "mongoose";
import { IsActive, IsAuthProvider, IUser, Role } from "./user.interface";
import { boolean } from "zod";

const authProviderSchema = new Schema<IsAuthProvider>({
    provider : {type : String,required : true },
    providerID :{type : String , required : true}
},{
    versionKey : false,
    _id : false
})


const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(IsActive),
      default: IsActive.ACTIVE,
    },
    isVerified: { type: boolean, default: true },
    auths : [authProviderSchema]
  },
  {
    timestamps: true,
    versionKey: false,
  },
);



export const User = model<IUser>("user", userSchema);

