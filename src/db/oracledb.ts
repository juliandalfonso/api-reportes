import oracledb from "oracledb";

export default class OracleDB {
  private static _instance: OracleDB;
  pool: oracledb.Pool;
  conected: Boolean = false;
  cnnAttrs: oracledb.PoolAttributes;
  private static connection: any;
  // private static currentConnection: oracledb.Connection;

  constructor() {
    console.log("Class initialized");

    this.cnnAttrs = {
      connectString: process.env.DB_HOST || "LOCALHOST",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      events: false,
      externalAuth: false,
      poolAlias: "ONL_DB",
      poolTimeout: 30,
      poolMax: 10,
      poolMin: 1,
      stmtCacheSize: 30,
    };
    // Creamos el pool de conexiones
    this.createPool();
  }

  private async createPool() {
    this.pool = await oracledb.createPool(this.cnnAttrs);
    this.conected = true;
    console.log("Pool created");
  }

  static async execQuery(
    query: string,
    parameters: oracledb.BindParameters,
    
    autoCommit: Boolean = false,
    closeConnection: boolean = true,
    resultSet: Boolean = false
  ) {
    try {
      // Iniciamos la conexion con el pool
      console.log("conectando execQuery");
      // console.log(parameters)
      this.connection = await this.instance.pool.getConnection();
      let result = await this.connection.execute(query, parameters, {
        autoCommit: autoCommit,
        outFormat: oracledb.OUT_FORMAT_ARRAY,
        resultSet: resultSet,
      });
      
      // Cerramos la conexion con el pool de conexiones
      if (closeConnection) {
        console.log("cerrando conexión execQuery");
        // this.doRelease(this.connection);
        this.connection.close()
      }

      //Caso en que no se necesite hacer mas consultas se cierra la conexion
    
      return result;

    } catch (err) {
      console.log(err);
      this.connection.close();
      throw err;
    }
  }
 
  static async execQueryObject(
    query: string,
    parameters: oracledb.BindParameters,
    
    autoCommit: Boolean = false,
    closeConnection: boolean = true,
    resultSet: Boolean = false
  ) {
    try {
      // Iniciamos la conexion con el pool
      console.log("conectando execQueryObject");
      // console.log(parameters)
      this.connection = await this.instance.pool.getConnection();
      
      let result = await this.connection.execute(query, parameters, {
        autoCommit: autoCommit,
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        resultSet: resultSet,
      });
      // Cerramos la conexion con el pool de conexiones
      if (closeConnection) {
        console.log("cerrando conexión execQueryObject");
        // this.doRelease(this.connection);
        this.connection.close()
      }

      //Caso en que no se necesite hacer mas consultas se cierra la conexion
    
      return result;

    } catch (err) {
      console.log(err);
      this.connection.close();
      throw err;
    }
  }
 

  static async execSingleQuery(
    query: string,
    resultSetParam: Boolean = false,
    closeConnection=true
  ) {
    try {
      // Iniciamos la conexion con el pool
      console.log("conectando execSingleQuery");
      // console.log(parameters)
      this.connection = await this.instance.pool.getConnection();
      let result = await this.connection.execute(query,[],{resultSet: resultSetParam});
      // Cerramos la conexion con el pool de conexiones
      if (closeConnection) {
        console.log("cerrando conexión execSingleQuery");

        // this.doRelease(this.connection);
        this.connection.close()
      }

      //Caso en que no se necesite hacer mas consultas se cierra la conexion
    
      return result.rows;

    } catch (err) {
      console.log(err);
      this.connection.close();
      throw err;
    }
  }

  static async execSingleQueryObject(
    query: string,
    resultSetParam: Boolean = false,
    closeConnection=true
  ) {
    try {
      // Iniciamos la conexion con el pool
      console.log("conectando execSingleQueryObject");
      // console.log(parameters)
      this.connection = await this.instance.pool.getConnection();
      let result = await this.connection.execute(query,[],{resultSet: resultSetParam, outFormat: oracledb.OUT_FORMAT_OBJECT});
      // Cerramos la conexion con el pool de conexiones
      if (closeConnection) {
        console.log("cerrando conexión execSingleQueryObject");

        // this.doRelease(this.connection);
        this.connection.close()
      }

      //Caso en que no se necesite hacer mas consultas se cierra la conexion
    
      return result.rows;

    } catch (err) {
      console.log(err);
      this.connection.close();
      throw err;
    }
  }


  static async fetchFromCursor(
    resultSet: oracledb.ResultSet<OracleDB>,
    closeConnection: boolean = true
  ) {
    
    try {
      // Obtenemos los datos suministrados po la base de datos y obtenemos la primera fila
      // console.log(resultSet)
      let result = await resultSet.getRows(0);
      resultSet.close();
      // console.log('result->',result)

      // Cerramos la conexion con el pool de conexiones
      if (closeConnection) {
        console.log("cerrando conexión fetchFromCursor");
        // this.doRelease(this.connection);
        this.connection.close()
      }

      return result;
    } catch (err) {
      console.log(err);
      return err;
    }
  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }


  //funcion llamada desde server.ts para cerrar la conexion a la base de datos
  public async closeConnection() {
    try {
      if (this.conected == true) {
        await this.pool.close();
        this.conected = false;
        console.log("Disconnected");
      }
    } catch (err) {
      throw err;
    }
  }

  public static doRelease(connection: any) {
    connection.release((err: any) => {
        if (err) {
            throw err;
        }
    });
  } 
}
