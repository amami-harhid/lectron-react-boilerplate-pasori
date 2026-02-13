import type { HistoriesMemberIdmRow } from '@/db/histories/historiesRow';

import * as DateUtils from '../../utils/dateUtils';

import { dbRun, dbGet, transactionBase } from './utils/serviceUtils';

/** IDMが紐づいているメンバーを取得する */
export const getMemberByIdm = async (idm: string):Promise<HistoriesMemberIdmRow> => {
    const query = 
        `SELECT M.*, I.idm, IFNULL(H.in_room, FALSE) AS in_room
         FROM members AS M
         LEFT OUTER JOIN idms AS I ON M.fcno = I.fcno
         LEFT OUTER JOIN histories AS H ON M.fcno = H.fcno AND H.date = date(?)
         WHERE I.idm = ?
         AND M.soft_delete = FALSE`;
    
    const today = new Date();
    const todayStr = DateUtils.dateToSqlite3Date(today);
    const row = await dbGet<HistoriesMemberIdmRow>(query, [idm, todayStr]);
    return row;
}

/** 入室にする・退室にする */
export const setInRoomByFcno = async (fcno:string, idm:string, in_room:boolean):Promise<boolean>=>{
    const memberIdm = await getMemberByIdm(idm);
    const rsult = await transactionBase(async ()=>{
        if(memberIdm == undefined) {
            // IDM紐づけがないとき
            // 何もしない
        }else{
            // IDM紐づけがあるとき
            const selectHistoriesByFcnoDate =
                `SELECT * FROM histories WHERE fcno = ? AND date = date(?)`;
            const today = new Date();
            const todayStr = DateUtils.dateToSqlite3Date(today);
            const historyRow = await dbGet(selectHistoriesByFcnoDate,[fcno, todayStr]);
            if(historyRow == undefined) {
                // 履歴がないとき
                const insertHistories =
                    `INSERT INTO histories 
                     (fcno, date, in_room, date_time)
                     VALUES ( ?, date(?), ?, datetime('now', 'localtime'))`;
                const changes = await dbRun(insertHistories, [fcno, todayStr, in_room]);
                if( changes > 0){
                    return true;
                }
            }else{
                // 履歴があるとき
                const updateHistories =
                    `UPDATE histories 
                     set in_room = ?, date_time = datetime('now', 'localtime')
                     WHERE fcno = ? AND date = date(?)`;
                const changes = await dbRun(updateHistories, [in_room, fcno, todayStr]);
                if( changes > 0) {
                    return true;
                }
            }
        }
        return false;
    });
    return rsult;
}


export const topPageServiceMethods = {
    getMemberByIdm: getMemberByIdm,
    setInRoomByFcno: setInRoomByFcno,
}

