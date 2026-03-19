import { Types } from "mongoose";

export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    GUIDE = "GUIDE",
    USER = "USER"
}

export type IsAuthProvider ={
    provider : 'google' | 'credentials'
    providerID : string
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}


export type IUser = {
    _id ?: Types.ObjectId;
    name : string;
    email : string;
    password ?: string;
    phone ?: string;
    picture ?: string;
    address ?: string;
    isDeleted ?: string;
    isActive ?: IsActive;
    isVerified ?: boolean;
    role : Role;
    auths : IsAuthProvider[];
    bookings ?: Types.ObjectId[];
    guides ?: Types.ObjectId[]; 
}