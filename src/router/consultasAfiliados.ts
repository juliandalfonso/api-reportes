// Route
import { Router, Request, Response } from "express";
// DB
import OracleDB from "../db/oracledb";
import oracledb from "oracledb";
// Middlewares
const { createLogRequest } = require("../middlewares/logs");
const { validateSecretKey } = require("../middlewares/authentication");

// Untils
const { finishLog, errorLog } = require("../untils/logs");

const afiliados = Router();

afiliados.get("/afiliado/get-alianzas",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    const sql = `SELECT * FROM B2BALIAN.afl_alianzas`;

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

afiliados.post("/afiliado/get-resumen-diario",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.AFL_ALIANZA_PLAYER.consultar_resumen_diario(:P_ID_AFILIADO, :P_FECHA_INICIAL, :P_FECHA_FINAL, :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      P_ID_AFILIADO: body.id_afiliado,
      P_FECHA_INICIAL: body.fecha_inicial,
      P_FECHA_FINAL: body.fecha_final,

      CUR_RESUMEN: {
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
      let result = await OracleDB.execQueryObject(sql, parameters, true, false);

      let ResultSet = result.outBinds;
      let resultCursor = result.outBinds.CUR_RESUMEN;
      let data = await OracleDB.fetchFromCursor(resultCursor, true);
      let response = {
        ok: true,
        resumen: data,
        coderror: ResultSet.CODERROR,
        descriptionerror: ResultSet.DESCRIPCIONERROR,
      };
      console.log(response);

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

afiliados.post("/afiliado/get-resumen-mensual",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.AFL_ALIANZA_PLAYER.consultar_resumen_mensual(:P_ID_AFILIADO, :P_PERIODO, :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      P_ID_AFILIADO: body.id_afiliado,
      P_PERIODO: body.periodo,

      CUR_RESUMEN: {
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
      let result = await OracleDB.execQueryObject(sql, parameters, true, false);

      let ResultSet = result.outBinds;
      let resultCursor = result.outBinds.CUR_RESUMEN;

      let data = await OracleDB.fetchFromCursor(resultCursor, true);

      let response = {
        ok: true,
        resumen: data,
        coderror: ResultSet.CODERROR,
        descriptionerror: ResultSet.DESCRIPCIONERROR,
      };
      console.log(response);

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

export default afiliados;
