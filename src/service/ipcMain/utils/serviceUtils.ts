import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import sqlite from 'sqlite3';
import { DatabaseRef } from '@/db/dbReference';
import { Transaction } from '@/db/dbCommon';

export const dbRun = async (query:string, params:any[]=[]): Promise<number>=>{
    const db = DatabaseRef.db;
    return new Promise<number>((resolve,reject)=>{
        const _query = query+';SELECT changes();';
        const stmt = db.prepare(_query)
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
}
export const dbAll = async <T>(query:string, params:any[]=[]):Promise<T[]>=>{
    const db = DatabaseRef.db;
    return new Promise<T[]>((resolve)=>{
        const stmt = db.prepare(query);
        stmt.all(params, (error, rows:T[])=>{
            if(error){
                stmt.finalize();
                throw error;
            }
            stmt.finalize();
            console.log(rows)
            resolve(rows);
        })
    });
}
export const dbGet = async <T>(query:string, params:any[]): Promise<T> =>{
    console.log('dbGet');
    const db = DatabaseRef.db;
    return new Promise<T>((resolve)=>{
        const stmt = db.prepare(query);
        console.log('stmt created');
        console.log('params',params);
        console.log('query',query);
        stmt.get(params, (error:Error, row:T)=>{
            if(error){
                console.log(error);
                logger.error(error);
                stmt.finalize();
                throw error;
            }
            stmt.finalize();
            resolve(row);
        });
    });
}
const transaction = async (query:string):Promise<boolean>=>{
    const db = DatabaseRef.db;
    return new Promise<boolean>((resolve)=>{
        db.run(query, (error)=>{
            if(error){
                logger.error(error);
                throw error;
            }
            resolve(true)
        })
    });
}
type AsyncFunction<TArgs extends any[], Tresult> = (...args: TArgs) => Promise<Tresult>;
export const transactionBase = async (callBack:AsyncFunction<any,boolean>):Promise<boolean> => {
    try{
        await transaction(Transaction.BEGIN);
        await new Promise<void>(async (resolve, reject)=>{
            try{
                await callBack();
            }catch(error){
                reject();
                throw error;
            }
            resolve();
        });
    }catch(error){
        transaction(Transaction.ROLLBACK);
        return false;
    }
    await transaction(Transaction.COMMIT);
    return true;    
}
