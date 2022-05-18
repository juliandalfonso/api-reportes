import { Request } from 'express';
import fs, { PathLike } from 'fs'
import path from 'path'

const moment = require('moment');

let finishLog = (status:Number, response:string, req:Request) => {

    const dir: PathLike = path.resolve(__dirname , `${ process.env.LOGS_PATH_CUPON }/access-valida-bono-${ moment().format('YYYY-MM-DD') }.log` );
    var log: string = '';
    log += req.params.log;
    log += moment().format('YYYY-MM-DD HH:mm:ss')+'|';
    log += status + '|';
    log += response + '\n';


    if (!fs.existsSync(dir)){
        fs.writeFileSync(dir, '', { flag: 'wx' });
    }

    fs.appendFileSync( dir, log);
}

let errorLog = (status:Number, response:string, req:Request, err:any) => {
    const dir: PathLike = path.resolve(__dirname , `${ process.env.LOGS_PATH_CUPON }/error-valida-bono-${ moment().format('YYYY-MM-DD') }.log` );
    var log: string = '';
    log += req.params.log;
    log += moment().format('YYYY-MM-DD HH:mm:ss')+'|';
    log += status + '|';
    log += response + '|';
    log += err.toString() + '\n';

    console.log(err)
    console.log( log );

    if (!fs.existsSync(dir)){
        fs.writeFileSync(dir, '', { flag: 'wx' });
    }

    fs.appendFileSync( dir, log);
}

module.exports = {
    finishLog,
    errorLog
}