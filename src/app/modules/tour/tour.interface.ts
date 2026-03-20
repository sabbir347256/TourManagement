import { Types } from "mongoose";

export type TourType = {
    name : string
}

export type ITour ={
    title : string,
    slug : string,
    images ?: string[];
    description ?: string;
    location ?: string;
    costForm ?: string;
    startDate ?: string;
    endDate ?: string;
    included ?: string[];
    excluded ?: string[];
    amenities ?: string[];
    tourPlan ?: string;
    maxGuest ?: number;
    minAge ?: number;
    division : Types.ObjectId;
    tourType : Types.ObjectId;
}