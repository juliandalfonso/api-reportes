import Server from "./server/server"

import * as dotenv from "dotenv"
import OracleDB from "./db/oracledb";

//routes
import oauth from "./router/oauth";
import usuarios from "./router/usuarios";
import roles from "./router/roles";
import gestores from "./router/consultasGestores";
import afiliados from "./router/consultasAfiliados";

// Env configuration
dotenv.config();
// JWT 
const PORT: any = process.env.PORT_SERVICES_FRONT || 3000;
const LLAVE: any = process.env.LLAVE || null;

const server = Server.init(parseInt(PORT));

// Instantiate DB
OracleDB.instance

// express use
server.app.use(oauth);
server.app.use(usuarios);
server.app.use(roles);

//consultas
server.app.use(gestores);
server.app.use(afiliados);




server.start(() => {
    console.log(`Aplicación corriendo en el puerto ${PORT}`);
});