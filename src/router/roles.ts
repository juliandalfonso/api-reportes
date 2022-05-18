// Route
import { Router, Request, Response } from "express";
// DB
import OracleDB from "../db/oracledb";
import oracledb from "oracledb";
import * as dotenv from "dotenv";
// Middlewares
const { createLogRequest } = require("../middlewares/logs");
const { validateSecretKey } = require("../middlewares/authentication");

// Untils
const { finishLog, errorLog } = require("../untils/logs");
//JWT
const jwt = require("jsonwebtoken");
dotenv.config();
const LLAVE: any = process.env.LLAVE;

const roles = Router();

roles.post("/get-rol",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql = `SELECT nombre                                                                                           
    FROM b2balian.seg_rol
    WHERE rol = :idRol`;

    const parameters = [body.IDRol];

    let responses = new Array();
    responses[0] = 200; // Registrado correctamente
    responses[1] = 422; // Usuario ya se encuentra registrado

    try {
      let result = await OracleDB.execQuery(sql, parameters, true, true);

      let resultquery = result;

      let response = {
        ok: true,
        rol: resultquery.rows[0],
      };
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

roles.get("/listar-roles",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    const sql = `SELECT nombre,ROL FROM b2balian.seg_rol where ACTIVO = 'A'`;

    let responses = new Array();
    responses[0] = 200; // Registrado correctamente
    responses[1] = 422; // Usuario ya se encuentra registrado

    try {
      let result = await OracleDB.execSingleQueryObject(sql, false, true);

      let resultquery = result;

      let response = {
        ok: true,
        response: resultquery,
      };
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

roles.post("/editar-rol-usuario",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    const {
      USUARIO,
      ROL,
      FECHA_INICIAL,
      FECHA_FINAL,
      FECHA_REGISTRO,
      USUARIO_REGISTRO,
    } = req.body;

    const sql =
      "BEGIN B2BALIAN.SEG_SEGURIDAD.agregar_usuario_rol(:p_usuario, :p_rol, :p_fecha_inicial,:p_fecha_final, :p_fecha_registro, :p_usuario_registro,  :CODERROR, :DESCRIPCIONERROR); END;";

    const parameters = {
      p_usuario: USUARIO,
      p_rol: ROL,
      p_fecha_inicial: FECHA_INICIAL,
      p_fecha_final: FECHA_FINAL,
      p_fecha_registro: FECHA_REGISTRO,
      p_usuario_registro: USUARIO_REGISTRO,
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
      let result = await OracleDB.execQueryObject(sql, parameters, true, true);

      let ResultSet = result.outBinds;

      let response = {
        ok: true,
        coderror: ResultSet.CODERROR,
        descriptionerror: ResultSet.DESCRIPCIONERROR,
      };
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

export default roles;
