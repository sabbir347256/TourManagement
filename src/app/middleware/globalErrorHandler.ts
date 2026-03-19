import { NextFunction, Request, Response } from "express";
import { success } from "zod";
import { envVars } from "../config/env";
import appError from "../errorHelpers/appError";

export const globalErrorHandler = (err:any,req : Request, res : Response, next: NextFunction) => {
    let statusCode = 500;
    const message  = ` ${err.message}`

    if(err instanceof appError){
        statusCode = err.statusCode
    }

    res.status(statusCode).json({
        success: false,
        message,
        err,
        stack : envVars.NODE_ENV === 'Development' ? err.stack : null
    })
}