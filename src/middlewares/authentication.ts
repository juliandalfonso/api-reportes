import { NextFunction, Request, Response, Router } from "express"
import * as dotenv from "dotenv"

const jwt = require('jsonwebtoken');
dotenv.config();
const LLAVE: any = process.env.LLAVE;

const validateSecretKey2 = Router();

let validateSecretKey = validateSecretKey2.use((req: Request, res: Response, next: NextFunction) => {

    const token = req.headers['access-token'];
    if (token) {
        jwt.verify(token, LLAVE, (err: any) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    mensaje: 'Token inválida'
                });
            } else {
                next();
            }
        });
    } else {
        res.status(403).json({
            mensaje: 'Token no proveída.'
        });
    }
})






module.exports = { validateSecretKey };