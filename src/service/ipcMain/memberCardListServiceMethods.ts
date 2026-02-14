import type { MemberRow } from '@/db/members/memberRow';
import type { MemberIdmRow } from '@/db/members/memberIdmRow';
import type { IdmRow } from '@/db/idms/idmRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

const getMember = async(fcno:string): Promise<MemberIdmRow> =>{
    const query = 
        `SELECT M.*, IFNULL(I.idm,'') AS idm FROM members AS M
         LEFT OUTER JOIN idms AS I ON M.fcno = I.fcno AND M.soft_delete = I.soft_delete
         WHERE M.fcno = ? AND M.soft_delete = FALSE`;
    const row = await dbGet<MemberIdmRow>(query, [fcno]);
    return row;
}

/** FCNO指定でIDMを更新する */
const setIdmByFcno = async(fcno:string, idm:string):Promise<boolean>=>{

    console.log('setIdmByFcno fcno,idm = ', fcno,idm);
    const query =
        `SELECT * FROM idms
         WHERE fcno = ?` 
    const row = await dbGet<IdmRow>(query,[fcno]);
    console.log('setIdmByFcno row=', row);
    if(row) {
        const query = 
            `UPDATE idms SET idm = ?, soft_delete = FALSE, date_time = datetime('now', 'localtime')
             WHERE fcno = ?`;
        const changes = await dbRun(query, [idm, fcno]);
        console.log('changes=',changes)
        if(changes>0){
            return true;
        }
        return false;
    }else{
        const query = 
            `INSERT INTO idms (fcno, idm, soft_delete, date_time)
             VALUES( ?, ?, FALSE, datetime('now', 'localtime') )`;
        const changes = await dbRun(query, [fcno, idm]);
        if(changes>0){
            return true;
        }
        return false;
    }
}

/** 全メンバーを取得する */
const getMembers = async():Promise<MemberIdmRow[]>=>{
    const selectAll =
        `SELECT M.*, IFNULL(I.idm,'') AS idm FROM members AS M
         LEFT OUTER JOIN idms AS I ON M.fcno = I.fcno
         WHERE M.soft_delete = FALSE
         ORDER BY M.kana ASC`;
    const rows = dbAll<MemberIdmRow>(selectAll,[]);
    return rows;
}


export const memberCardListPageServiceMethods = {
    setIdmByFcno: setIdmByFcno,
    getMembers: getMembers,
}
