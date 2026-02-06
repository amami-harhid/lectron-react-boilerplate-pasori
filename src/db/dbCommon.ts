// Main/Render どちらも import できるはず。
import sqlite from 'sqlite3';
import { Logger } from '../log/logger';
const logger = new Logger();
const run = (db:sqlite.Database, query:string, params:any[]=[]):Promise<number> => {
    return new Promise<number>((resolve, reject)=>{
        const _query = `${query}; SELECT changes();`; // 追加変更削除された行数を返す
        const stmt = db.prepare(_query);
        stmt.run(params, function(err:Error){
            if (err) {
                logger.error(err);
                stmt.finalize();
                reject(err);
            }
            const runResult = this as sqlite.RunResult;
            const changes = runResult.changes;
            stmt.finalize();
            resolve(changes);
        });
    })
};
// 対象の行をすべて返す
const all = <T>(db:sqlite.Database, query:string, params:any[]=[]):Promise<T[]> => {
    return new Promise<T[]>((resolve, reject)=>{
        const stmt = db.prepare(query);
        stmt.all(params,(err:Error, rows:T[])=>{
            if (err) {
                logger.error(err);
                throw(err);
            }
            stmt.finalize();
            resolve(rows);            
        })
    });
}
// 1行だけ返す
const get = <T>(db:sqlite.Database, query:string, params:any[]=[]):Promise<T> => {
    return new Promise<T>((resolve, reject)=>{
        const stmt = db.prepare(query);
        stmt.get(params,(err:Error, row:T)=>{
            if (err) reject(err);
            stmt.finalize();
            resolve(row);
        });
    });
}
type Exec = (db:sqlite.Database, ...args:any[]) => Promise<any>;
export type Method = {
    name: string,
    exec: Exec,
}
export const exec = {
    all: all,
    get: get,
    run: run,
}
