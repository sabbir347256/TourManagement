import { Request, Response } from "express";

type Tmeta ={
    total : number
}

type Tresponse<T> ={
    statusCode : number;
    success : boolean;
    message : string;
    data : T;
    meta ?: Tmeta;
};

export const sendResponse = <T>(res :Response, data: Tresponse<T>) => {
    res.status(data.statusCode).json({
        statusCode : data.statusCode,
        success : data.success,
        message : data.message,
        meta : data.meta,
        data : data.data
    })
}

