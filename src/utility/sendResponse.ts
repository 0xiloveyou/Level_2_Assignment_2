import type { Response } from "express";

type TResponse<T> = {
    statusCode : number;
    sucess : boolean;
    message : string;
    data? : T;
    error? : any;
}

const sendResponse = <T>(res : Response, data : TResponse<T>) => {
    res.status(data.statusCode).json({
    sucess : data.sucess,
    message : data.message,
    data : data.data,
    error : data.error,
   })
}

export default sendResponse