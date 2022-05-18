import { NextFunction, Request, Response } from "express"
const moment = require('moment');

let createLogRequest = ( req: Request, res:Response, next:NextFunction ) => {
    var log: string = '';
    log += moment().format('YYYY-MM-DD HH:mm:ss') + '|';
    log += JSON.stringify(req.body) + '|';

    req.params.log = log;

    next(); 
}

module.exports = {
    createLogRequest
}