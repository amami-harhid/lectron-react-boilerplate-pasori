import type { MemberRow } from '@/db/members/memberRow';
import type { IdmRow } from '@/db/idms/idmRow';
import type { MemberIdmRow } from '@/db/members/memberIdmRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

/** FCNO指定でIDMを紐づける */
const registIdmToMemberByFcno = async(fcno:string,idm:string):Promise<boolean>=>{
    const rsult = await transactionBase(async ()=>{
        // FCNO指定でメンバーが存在し、FCNO指定＋IDM指定で idmsがあるとき
        const selectMemberQuery = 
            `SELECT * FROM members WHERE fcno = ? AND soft_delete = FALSE`;
        const memberRow = await dbGet<MemberRow>(selectMemberQuery, [fcno]);
        if(memberRow){
            const selectIdmQuery =
                `SELECT * FROM idms WHERE fcno = ?`;
            const idmRow = await dbGet<IdmRow>(selectIdmQuery, [fcno]);
            if(idmRow) {
                if( idmRow.idm == ''){
                    // （存在するが）紐づいていない
                    const updateIdmQuery = 
                        `UPDATE idms SET idm = ?, date_time = datetime('now', 'localtime')
                        WHERE fcno = ?`;
                    const changes = await dbRun(updateIdmQuery, [idm, fcno]);
                    if( changes > 0) {
                        return true;
                    }
                }else{
                    //（変更不可）既に紐づいている
                }
            }else{
                // （存在しない）紐づいていない
                const insertIdmQuery =
                    `INSERT INTO idms
                     (fcno, idm, date_time)
                     VALUES(?, ?, datetime('now', 'localtime'))`;
                const changes = await dbRun(insertIdmQuery, [fcno, idm]);
                if(changes>0){
                    return true;
                }
            }
        }
        return false;
    });
    return rsult;
}

/** FCNO指定でIDM紐づけを解除する */
const releaseIdmToMemberByFcno = async(fcno:string):Promise<boolean>=>{
    const query = 
        `UPDATE idms SET idm = '', date_time = datetime('now', 'localtime')
         WHERE fcno = ?`;
    const changes = await dbRun(query, [fcno]);
    if(changes>0)
        return true;
    else
        return false;
}
/** FCNOを指定してメンバーを取得する */
const getMemberByFcno = async(fcno:string):Promise<MemberIdmRow>=>{
    const query = 
        `SELECT M.*, I.idm FROM members AS M
         LEFT OUTER JOIN idms AS I
         WHERE M.fcno = I.fcno
         AND M.fcno = ? AND M.soft_delete = FALSE`;
    const row = await dbGet<MemberIdmRow>(query, [fcno]);
    return row;
}
/** IDMを指定してメンバーを取得する */
const getMemberByIdm = async(idm:string):Promise<MemberIdmRow>=>{
    const query = 
        `SELECT * FROM members AS M
         LEFT OUTER JOIN idms AS I
         WHERE M.fcno = I.fcno 
         AND idm = ? AND M.soft_delete = FALSE`;
    const row = await dbGet<MemberIdmRow>(query, [idm]);
    return row;
}
/** Idmが紐づいていないメンバーを取得する */
const getMemberIdmIsEmpty = async(idm:string):Promise<MemberIdmRow[]>=>{
    const query = 
        `SELECT * FROM members AS M
         LEFT OUTER JOIN idms AS I
         WHERE M.fcno = I.fcno
         AND (I.idm = '' OR I.idm = NULL) AND M.soft_delete = FALSE`;
    const rows = await dbAll<MemberIdmRow>(query, [idm]);
    return rows;
}

export const idmRegisterServiceMethods = {
    registIdmToMemberByFcno: registIdmToMemberByFcno,
    releaseIdmToMemberByFcno: releaseIdmToMemberByFcno,
    getMemberByFcno: getMemberByFcno,
    getMemberByIdm: getMemberByIdm,
    getMemberIdmIsEmpty: getMemberIdmIsEmpty,
} as const;