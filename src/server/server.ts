import express from "express"
import path from "path"
import OracleDB from "../db/oracledb"
import * as bodyParser from 'body-parser'
import https from 'https'
import http from 'http'

export default class Server {

    public app: express.Application;
    public port: number;

    constructor( port: number ){
        this.port = port;
        this.app = express();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    static init ( port:number ){
        return new Server( port );
    }

    private publicFolder(){
        const publicPath = path.resolve( __dirname, '../public' );
        this.app.use( express.static( publicPath ) );
    }

    start( callback: Function ){
        this.publicFolder();

        const options = {
            key: process.env.SSLKEY,
            cert: process.env.SSLCERT,
            passphrase: process.env.SSLPASS,
        }

        const protocol = (process.env.SSLKEY) ? https : http;

        protocol.createServer((process.env.SSLKEY) ? options : {}, this.app)
        .listen(this.port, callback())

        process.on('SIGINT', function() {
            OracleDB.instance.closeConnection();
            process.exit();
        });
    }

}