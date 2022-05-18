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

const gestores = Router();

gestores.post("/gestor/get-resumen-diario",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.SPO_TERMINAL_PLAYER.consultar_resumen_diario(:P_ID_AFILIADO, :P_FECHA_INICIAL, :P_FECHA_FINAL, :cur_resumen, :coderror, :descripcionerror); END;";

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

gestores.post("/gestor/get-resumen-mensual",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.SPO_TERMINAL_PLAYER.consultar_resumen_mensual(:P_ID_AFILIADO, :P_PERIDO, :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      P_ID_AFILIADO: body.id_afiliado,
      P_PERIDO: body.periodo,

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




gestores.post("/gestor/get-ptovta",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.SPO_TERMINAL_PLAYER.con_listado_ptovta_x_gestor(:p_id_gestor, :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      p_id_gestor: body.id_gestor,

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



gestores.post("/gestor/get-terminales",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.SPO_TERMINAL_PLAYER.con_listado_terminal_x_ptovta(:p_id_gestor, :p_id_pto_vta, :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      p_id_gestor: body.id_gestor,
      p_id_pto_vta: body.id_ptvta,

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



gestores.post("/gestor/get-resumen-diario-ptovta",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.SPO_TERMINAL_PLAYER.con_res_dia_x_ptoventa(:p_id_gestor, :p_id_ptovta, :p_fecha_inicial, :p_fecha_final,  :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      p_id_gestor: body.id_gestor,
      p_id_ptovta: body.id_ptvta,
      p_fecha_inicial: body.fecha_inicial,
      p_fecha_final: body.fecha_final,

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



gestores.post("/gestor/get-resumen-diario-terminal",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "BEGIN B2BALIAN.SPO_TERMINAL_PLAYER.con_res_dia_x_terminal(:p_id_gestor, :p_id_ptovta, :p_id_terminal, :p_fecha_inicial, :p_fecha_final,  :cur_resumen, :coderror, :descripcionerror); END;";

    const parameters: any = {
      p_id_gestor: body.id_gestor,
      p_id_ptovta: body.id_ptvta,
      p_id_terminal: body.id_terminal,
      p_fecha_inicial: body.fecha_inicial,
      p_fecha_final: body.fecha_final,

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


gestores.get("/gestor/get-gestores",
  [validateSecretKey],
  [createLogRequest],
  async (req: Request, res: Response) => {
    let body = req.body;
    const sql =
      "SELECT * FROM b2balian.spo_gestores t WHERE t.id_gestor IN (SELECT id_gestor FROM b2balian.spo_resumen_termial_diario)";

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

// gestores.get("/gestor/get-ptovta",
// [validateSecretKey],
// [createLogRequest],
// async (req: Request, res: Response) => {
//   let id_gestor = req.body;
//   const sql =
//   `SELECT * FROM B2BALIAN.spo_puntovta WHERE id_gestor = ${{id_gestor}}`;
  
//   let responses = new Array();
//   responses[0] = 200; // Registrado correctamente
//   responses[1] = 422; // Usuario ya se encuentra registrado
  
//   try {
//         let result = await OracleDB.execSingleQueryObject(sql, false, true);
  
//         let resultquery = result;
        
//         let response = {
//           ok: true,
//           response: resultquery,
//         };
//         finishLog(200, JSON.stringify(response), req);
//         res.status(200).json(response);
//       } catch (err) {
//         let response = {
//           ok: false,
//         };
//         errorLog(400, JSON.stringify(response), req, err);
//         return res.status(400).json(response);
//       }
//     }
//     );

// gestores.get("/gestor/get-resumen-diario-ptovta",
//   [validateSecretKey],
//   [createLogRequest],
//   async (req: Request, res: Response) => {
//     let {
//       id_ptvta,
//       fecha,
//     } = req.body;
//     const sql =
//       `SELECT * FROM b2balian.spo_resumen_termial_diario t WHERE id_puntovta = ${{id_ptvta}} AND fecha = ${{fecha}} ORDER BY t.id_terminal;`;

//       let responses = new Array();
//       responses[0] = 200; // Registrado correctamente
//       responses[1] = 422; // Usuario ya se encuentra registrado
  
//       try {
//         let result = await OracleDB.execSingleQueryObject(sql, false, true);
  
//         let resultquery = result;
  
//         let response = {
//           ok: true,
//           response: resultquery,
//         };
//         finishLog(200, JSON.stringify(response), req);
//         res.status(200).json(response);
//       } catch (err) {
//         let response = {
//           ok: false,
//         };
//         errorLog(400, JSON.stringify(response), req, err);
//         return res.status(400).json(response);
//       }
//     }
// );

// gestores.get("/gestor/get-terminales",
//   [validateSecretKey],
//   [createLogRequest],
//   async (req: Request, res: Response) => {
//     let {
//       id_gestor,
//       id_ptvta,
//     } = req.body;
//     const sql =
//       `SELECT * FROM B2BALIAN.SPO_TERMINALES WHERE id_gestor = ${{id_gestor}}  AND id_puntovta = ${{id_ptvta}}`;

//       let responses = new Array();
//       responses[0] = 200; // Registrado correctamente
//       responses[1] = 422; // Usuario ya se encuentra registrado
  
//       try {
//         let result = await OracleDB.execSingleQueryObject(sql, false, true);
  
//         let resultquery = result;
  
//         let response = {
//           ok: true,
//           response: resultquery,
//         };
//         finishLog(200, JSON.stringify(response), req);
//         res.status(200).json(response);
//       } catch (err) {
//         let response = {
//           ok: false,
//         };
//         errorLog(400, JSON.stringify(response), req, err);
//         return res.status(400).json(response);
//       }
//     }
// );

// gestores.get("/gestor/get-resumen-diario-terminal",
//   [validateSecretKey],
//   [createLogRequest],
//   async (req: Request, res: Response) => {
//     let {
//       id_gestor,
//       id_ptvta,
//       fecha,
//     } = req.body;
//     const sql =
//       `SELECT * FROM B2BALIAN.spo_resumen_termial_diario WHERE id_puntovta = ${{id_ptvta}}  AND id_gestor = ${{id_gestor}} AND fecha = ${{fecha}}`;

//       let responses = new Array();
//       responses[0] = 200; // Registrado correctamente
//       responses[1] = 422; // Usuario ya se encuentra registrado
  
//       try {
//         let result = await OracleDB.execSingleQueryObject(sql, false, true);
  
//         let resultquery = result;
  
//         let response = {
//           ok: true,
//           response: resultquery,
//         };
//         finishLog(200, JSON.stringify(response), req);
//         res.status(200).json(response);
//       } catch (err) {
//         let response = {
//           ok: false,
//         };
//         errorLog(400, JSON.stringify(response), req, err);
//         return res.status(400).json(response);
//       }
//     }
// );
  

    
    
    
    
    export default gestores;
    