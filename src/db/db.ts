import {app} from 'electron';
import path from 'path';
import { Logger } from "../log/logger";
import sqlite from 'sqlite3';
const sqlite3 = sqlite.verbose();
import webpackPaths from '../../.erb/configs/webpack.paths';

const logger = new Logger();
const databaseName = "pasori2.sqlite3";

const sqlPath = ():string => {
    if(process.env.NODE_ENV === 'development'){
        const sqlPath = path.join(webpackPaths.appPath,'sql',databaseName);
        return sqlPath;
    }
    const db_path = app.getPath('userData');
    const sqlPath = path.join(db_path, databaseName);
    return sqlPath;
}

console.log(sqlPath());

export const db = new sqlite3.Database(sqlPath(), (err:Error|null):void =>{
    if(err){
        logger.error(err);
    }
});

