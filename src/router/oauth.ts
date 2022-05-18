// Route
import { Router, Request, Response } from "express";
// DB
import OracleDB from "../db/oracledb";
import oracledb from "oracledb";
import * as dotenv from "dotenv";
// Middlewares
const { createLogRequest } = require("../middlewares/logs");

// Untils
const { finishLog, errorLog } = require("../untils/logs");
//JWT
const jwt = require("jsonwebtoken");
dotenv.config();
const LLAVE: any = process.env.LLAVE;

const oauth = Router();

oauth.post("/validar-usuario",
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    console.log(req.body);
    const sql =
      "BEGIN B2BALIAN.SEG_SEGURIDAD.validar_usuario(:P_USUARIO, :P_CLAVE, :P_RESULT, :CODERROR, :DESCRIPCIONERROR); END;";

    const parameters: any = {
      P_USUARIO: body.user,
      P_CLAVE: body.password,

      P_RESULT: {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR,
      },
      CODERROR: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
      DESCRIPCIONERROR: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
      },
    };

    let responses = new Array();
    responses[0] = 200; // Registrado correctamente
    responses[1] = 422; // Usuario ya se encuentra registrado

    try {
      let result = await OracleDB.execQuery(sql, parameters, true, false);

      let ResultSet = result.outBinds;
      let resultCursor = result.outBinds.P_RESULT;

      let data = await OracleDB.fetchFromCursor(resultCursor, true);
      let response = {};
      if (ResultSet.CODERROR) {
        const payload = {
          check: true,
        };
        const token = jwt.sign(payload, LLAVE, {
          expiresIn: 1440,
        });
        response = {
          ok: true,
          resumen: data,
          coderror: ResultSet.CODERROR,
          descriptionerror: ResultSet.DESCRIPCIONERROR,
          token: token,
        };
      } else {
        response = {
          ok: true,
          resumen: data,
          coderror: ResultSet.CODERROR,
          descriptionerror: ResultSet.DESCRIPCIONERROR,
        };
      }

      finishLog(200, JSON.stringify(response), req);
      res.status(200).json(response);
    } catch (err) {
      let response = {
        ok: false,
      };
      errorLog(400, JSON.stringify(response), req, err);
      return res.status(400).json(response);
    }
  }
);

export default oauth;
