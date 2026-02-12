import type { CardRow } from '@/db/cards/cardRow';

import * as DateUtils from '../../utils/dateUtils';

import { dbRun, dbGet, transactionBase } from './utils/serviceUtils';

/** IDMが紐づいているメンバーを取得する */
export const getMemberByIdm = async (idm: string):Promise<CardRow> => {
    const query = `SELECT * FROM cards WHERE idm = ? AND soft_delete = FALSE`;
    const row = await dbGet<CardRow>(query, [idm]);
    return row;
}

/** 入室にする・退室にする */
export const setInRoomByFcno = async (fcno:string, idm:string, in_room:boolean):Promise<boolean>=>{
    const rsult = await transactionBase(async ()=>{
        const updateInRoomByFcnoQuery = 
            `UPDATE cards SET in_room = ?,
             date_time = datetime('now', 'localtime') WHERE fcno = ? AND soft_delete = FALSE`;
        await dbRun(updateInRoomByFcnoQuery, [in_room,fcno]);
        const selectByFcno = 
            `SELECT * FROM cards WHERE fcno = ? AND soft_delete = FALSE`;
        const activeMember = await dbGet(selectByFcno, [fcno]);
        if( activeMember == undefined ){
            throw new Error(`activeMember not exists fcno=(${fcno})`);
        }
        const selectHistoriesByFcnoDate =
            `SELECT * FROM histories WHERE fcno = ? AND date_in = date(?)`;
        const today = new Date();
        const historyRow = await dbGet(selectHistoriesByFcnoDate,[fcno, today]);
        if(historyRow == undefined) {
            const insertHistory =
                `INSERT INTO histories
                 (fcno, idm, in_room, date_in, date_out, date_time)
                 VALUES(?, ?, TRUE, date('now', 'localtime'), '', datetime('now', 'localtime'))`;
            await dbRun(insertHistory, [fcno, idm]);
        }else{
            const updateHistory = 
                `UPDATE histories
                 SET in_room = TRUE, date_out = ''
                 WHERE fcno = ? AND idm = ? AND date_in = date(?)`;
            const todayStr = DateUtils.dateToSqlite3Date(today);
            await dbRun(updateHistory, [fcno, idm, todayStr]);
        }
        return true;
    });
    return rsult;
}


export const topPageServiceMethods = {
    getMemberByIdm: getMemberByIdm,
    setInRoomByFcno: setInRoomByFcno,
}

