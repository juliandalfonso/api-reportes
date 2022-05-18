// Route
import { Router, Request, Response } from "express";
// DB
import OracleDB from "../db/oracledb";
import oracledb from "oracledb";
// Middlewares
const { createLogRequest } = require("../middlewares/logs");
const { validateSecretKey } = require("../middlewares/authentication");
import * as dotenv from "dotenv";
dotenv.config();

const LLAVE: any = process.env.LLAVE;

// Untils
const { finishLog, errorLog } = require("../untils/logs");
import * as CryptoJS from "crypto-js";
import { GLOBAL } from "./global";
const usuarios = Router();

usuarios.post("/get-user-info",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;

    const sql = `SELECT usuario, 
    u.documento,
    u.estado,
    u.fecha_inicio,
    u.email,
    u.colaborador
      FROM b2balian.seg_usuario u where usuario = :usuarioU`;

    const parameters = [body.usuario];
    let responses = new Array();
    responses[0] = 200;
    responses[1] = 422;

    try {
      let result = await OracleDB.execQueryObject(sql, parameters, true);
      let response = {
        ok: true,
        usuario: result.rows[0],
      };
      finishLog(200, JSON.stringify(response), req);
      res.status(200).json(response);
    } catch (err) {
      let response = {
        ok: false,
        error: err,
      };
      errorLog(400, JSON.stringify(response), req, err);
      return res.status(400).json(response);
    }
  }
);

usuarios.post("/get-user-widgets",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    console.log(body);
    const sql = ``;

    try {
      // let result = await OracleDB.execQuery(sql, parameters,true);
      let response = GLOBAL
      
              
      if(body.IDRol == '1') { 
        finishLog(200, JSON.stringify(response), req);
        res.status(200).json(new Array(response.afiliados,response.gestores ));
      }
      else if(body.IDRol == '2') { 
        finishLog(200, JSON.stringify(response), req);
        res.status(200).json(new Array(response.afiliados));
      }
      else if(body.IDRol == '3') { 
        finishLog(200, JSON.stringify(response), req);
        res.status(200).json(new Array(response.gestores)); }
      else{
        finishLog(400, JSON.stringify(response), req);
        res.status(400).json(new Array(response.error));     
      }      

    } catch (err) {
      let response = {
        ok: false,
        error: err,
      };
      errorLog(400, JSON.stringify(response), req, err);
      return res.status(400).json(response);
    }
  }
);

usuarios.post("/agregar-usuario",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    const {
      USUARIO,
      DOCUMENTO,
      CLAVE,
      FECHA_PROXIMO_CAMBIO,
      ESTADO,
      FECHA_REGISTRO,
      USUARIO_REGISTRO,
      FECHA_INICIO,
      COLABORADOR,
      EMAIL,
    } = req.body;

    const parameters = {
      p_usuario: USUARIO,
      p_documento: DOCUMENTO,
      p_clave: CLAVE,
      p_intentos: 2,
      p_fecha_proximo_cambio: FECHA_PROXIMO_CAMBIO,
      p_estado: ESTADO,
      p_fecha_registro: FECHA_REGISTRO,
      p_usuario_registro: USUARIO_REGISTRO,
      p_fecha_inicio: FECHA_INICIO,
      p_colaborador: COLABORADOR,
      p_email: EMAIL,
      coderror: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
      descriptionerror: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
      },
    };

    const sql =
      "BEGIN B2BALIAN.SEG_SEGURIDAD.agregar_usuario(:p_usuario, :p_documento, :p_clave, :p_intentos, :p_fecha_proximo_cambio, :p_estado, :p_fecha_registro, :p_usuario_registro, :p_fecha_inicio, :p_colaborador, :p_email,:coderror, :descriptionerror); END;";

    let responses = new Array();
    responses[0] = 200;
    responses[1] = 422;
    console.log(parameters);

    try {
      let result = await OracleDB.execQueryObject(sql, parameters, true, true);
      let ResultSet = result.outBinds;

      let response = {
        ok: true,
        coderror: ResultSet.coderror,
        descriptionerror: ResultSet.descriptionerror,
      };
      finishLog(200, JSON.stringify(response), req);
      res.status(200).json(response);
    } catch (err) {
      let response = {
        ok: false,
        error: err,
      };
      errorLog(400, JSON.stringify(response), req, err);
      return res.status(400).json(response);
    }
  }
);

usuarios.put("/editar-usuario",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    const {
      USUARIO,
      CLAVE,
      FECHA_PROXIMO_CAMBIO,
      ESTADO,
      FECHA_REGISTRO,
      USUARIO_REGISTRO,
      FECHA_INICIO,
      COLABORADOR
    } = req.body;

    const iv = CryptoJS.enc.Base64.parse("#base64IV#");
    const key = CryptoJS.enc.Base64.parse(LLAVE.trim());
    const decrypted = CryptoJS.AES.decrypt(CLAVE, key, { iv: iv });

    const parameters = {
      p_usuario: USUARIO,
      p_clave: CLAVE,
      p_intentos: 2,
      p_fecha_proximo_cambio: FECHA_PROXIMO_CAMBIO,
      p_estado: ESTADO,
      p_fecha_registro: FECHA_REGISTRO,
      p_usuario_registro: USUARIO_REGISTRO,
      p_fecha_inicio: FECHA_INICIO,
      p_colaborador: COLABORADOR,
      coderror: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
      descripcionerror: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
      },
    };
    const sql =
      "BEGIN B2BALIAN.SEG_SEGURIDAD.editar_usuario(:p_usuario, :p_clave, :p_intentos, :p_fecha_proximo_cambio, :p_estado, :p_fecha_registro, :p_usuario_registro, :p_fecha_inicio, :p_colaborador, :coderror, :descripcionerror); END;";

    let responses = new Array();
    responses[0] = 200; // Registrado correctamente
    responses[1] = 422; // Usuario ya se encuentra registrado
    try {
      let result = await OracleDB.execQueryObject(sql, parameters, true, true);
      let ResultSet = result.outBinds;

      let response = {
        ok: true,
        coderror: ResultSet.coderror,
        descriptionerror: ResultSet.descripcionerror,
      };
      finishLog(200, JSON.stringify(response), req);
      res.status(200).json(response);
    } catch (error) {
      let response = {
        ok: false,
      };
      errorLog(400, JSON.stringify(response), req, error);
      return res.status(400).json(response);
    }
  }
);

usuarios.post("/eliminar-usuario",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    const { usuario } = req.body;

    const parameters = {
      p_usuario: usuario,
      coderror: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
      descriptionerror: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
      },
    };
    const sql =
      "BEGIN B2BALIAN.SEG_SEGURIDAD.eliminar_usuario(:p_usuario,:coderror,:descriptionerror); END;";
    let responses = new Array();
    responses[0] = 200; // Registrado correctamente
    responses[1] = 422; // Usuario ya se encuentra registrado
    try {
      let result = await OracleDB.execQueryObject(sql, parameters, true, false);
      let ResultSet = result.outBinds;

      let response = {
        ok: true,
        coderror: ResultSet.coderror,
        descriptionerror: ResultSet.descriptionerror,
      };
      finishLog(200, JSON.stringify(response), req);
      res.status(200).json(response);
    } catch (error) {
      let response = {
        ok: false,
      };
      errorLog(400, JSON.stringify(response), req, error);
      return res.status(400).json(response);
    }
  }
);

usuarios.get("/listar-usuarios",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    console.log('listar-usuarios');
    
    const sql =
      "BEGIN B2BALIAN.SEG_SEGURIDAD.listar_usuarios(  :CODERROR, :DESCRIPCIONERROR,:P_RESULT); END;";
    // const sql = `SELECT U.*  FROM B2BALIAN.SEG_USUARIO`;

    const parameters = {
      CODERROR: {
        dir: oracledb.BIND_OUT,
        type: oracledb.NUMBER,
      },
      DESCRIPCIONERROR: {
        dir: oracledb.BIND_OUT,
        type: oracledb.STRING,
      },
      P_RESULT: {
        dir: oracledb.BIND_OUT,
        type: oracledb.CURSOR,
      },
    };

    try {
      let result = await OracleDB.execQueryObject(sql, parameters, true, false);
      let ResultSet = result.outBinds;
      let resultCursor = result.outBinds.P_RESULT;
      let data = await OracleDB.fetchFromCursor(resultCursor, true);
      let response = {
        ok: true,
        response: data,
      };
      finishLog(200, JSON.stringify(response), req);
      res.status(200).json(response);
    } catch (error) {
      let response = {
        ok: false,
      };
      errorLog(400, JSON.stringify(response), req, error);
      return res.status(400).json(response);
    }
  }
);

export default usuarios;
