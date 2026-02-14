import type { MemberIdmRow } from '@/db/members/memberIdmRow';
import type { IdmRow } from '@/db/idms/idmRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

const getIdm = async(idm:string): Promise<MemberIdmRow> =>{
    const query =
        `SELECT * FROM idms
         WHERE idm = ?`; // 論理削除は考慮しない
    const row = await dbGet<MemberIdmRow>(query, [idm]);
    return row;
}

/** FCNO指定でIDMを更新する */
const setIdmByFcno = async(fcno:string, idm:string):Promise<boolean>=>{

    const query =
        `SELECT * FROM idms
         WHERE fcno = ?`; // 論理削除されているかは考慮しない
    const row = await dbGet<IdmRow>(query,[fcno]);
    if(row) {
        if(row.fcno == fcno){
            // idmが登録されているメンバーと一致(論理削除を含む)
            const query =
              `UPDATE idms SET idm = ?, soft_delete = FALSE, date_time = datetime('now', 'localtime')
               WHERE fcno = ?`;
            const changes = await dbRun(query, [idm, fcno]);
            if(changes>0){
                return true;
            }
            return false;
        }else{
            // IDMは使用済
            return false;
        }
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
    getIdm: getIdm,
    setIdmByFcno: setIdmByFcno,
    getMembers: getMembers,
}
