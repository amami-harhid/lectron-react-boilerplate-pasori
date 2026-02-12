import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import sqlite from 'sqlite3';
import { DatabaseRef } from '@/db/dbReference';
import { Transaction } from '@/db/dbCommon';
import type { CardRow } from '@/db/cards/cardRow';

import * as DateUtils from '../../utils/dateUtils';
import * as IpcServices from '@/channel/ipcService';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';
import { resolve } from 'path';
import { rejects } from 'assert';

/** FCNO指定でIDMを紐づける */
const registIdmToMemberByFcno = async(fcno:string,idm:string):Promise<boolean>=>{
    const query = 
        `UPDATE cards SET idm = ?, date_time = datetime('now', 'localtime')
         WHERE fcno = ? AND soft_delete = FALSE`;
    const changes = await dbRun(query, [fcno, idm]);
    if(changes>0)
        return true;
    else
        return false;
}
/** FCNO指定でIDM紐づけを解除する */
const releaseIdmToMemberByFcno = async(fcno:string):Promise<boolean>=>{
    const query = 
        `UPDATE cards SET idm = '', date_time = datetime('now', 'localtime')
         WHERE fcno = ? AND soft_delete = FALSE`;
    const changes = await dbRun(query, [fcno]);
    if(changes>0)
        return true;
    else
        return false;
}
/** FCNOを指定してメンバーを取得する */
const getMemberByFcno = async(fcno:string):Promise<CardRow>=>{
    const query = `SELECT * FROM cards WHERE fcno = ? AND soft_delete = FALSE`;
    const row = await dbGet<CardRow>(query, [fcno]);
    return row;
}
/** IDMを指定してメンバーを取得する */
const getMemberByIdm = async(idm:string):Promise<CardRow>=>{
    const query = `SELECT * FROM cards WHERE idm = ? AND soft_delete = FALSE`;
    const row = await dbGet<CardRow>(query, [idm]);
    return row;
}
/** Idmが紐づいていないメンバーを取得する */
const getMemberIdmIsEmpty = async(idm:string):Promise<CardRow[]>=>{
    const query = `SELECT * FROM cards WHERE idm = '' AND soft_delete = FALSE`;
    const rows = await dbAll<CardRow>(query, []);
    return rows;
}

export const idmRegisterServiceMethods = {
    registIdmToMemberByFcno: registIdmToMemberByFcno,
    releaseIdmToMemberByFcno: releaseIdmToMemberByFcno,
    getMemberByFcno: getMemberByFcno,
    getMemberByIdm: getMemberByIdm,
    getMemberIdmIsEmpty: getMemberIdmIsEmpty,
} as const;