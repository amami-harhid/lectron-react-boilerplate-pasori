import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { CardRow } from '@/db/cards/cardRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

/** FCNO指定でメンバーを取得する */
const getMemberByFcno = async(fcno:string):Promise<CardRow>=>{
    console.log('getMemberByFcno');
    const query = `SELECT * FROM cards WHERE fcno = ? AND soft_delete = FALSE`;
    const row = await dbGet<CardRow>(query, [fcno]);
    console.log('getMemberByFcno executed.');
    return row;
}

/** 全メンバーを取得する */
const getMembers = async():Promise<CardRow[]>=>{
    console.log('methods getMembers');
    const selectAll = 
        `SELECT * FROM cards WHERE soft_delete = FALSE`;
    const rows = dbAll<CardRow>(selectAll,[]);
    return rows;
}

/** メンバーを追加する */
const addMember = async(row: CardRow):Promise<boolean>=>{
    const rsult = await transactionBase(async ():Promise<boolean>=>{
        const insert = `INSERT INTO cards
                (fcno, name, kana, mail, in_room, idm, soft_delete, date_time)
                VALUES (?, ?, ?, ?, FALSE, '', FALSE, datetime('now', 'localtime'))`;
        const changes = await dbRun(insert, [row.fcno, row.name, row.kana, row.mail]);
        if(changes>0)
            return true;
        else
            return false;
    });
    return rsult;
}

/** FCNO指定でメンバー情報を更新する */
const updateMemberByFcno = async(fcno: string, row: CardRow):Promise<boolean>=>{
    console.log('updateMemberByFcno')
    const rsult = await transactionBase(async ():Promise<boolean>=>{
        const update = `UPDATE cards
                SET name = ?, kana = ?, mail = ?
                WHERE fcno = ? AND soft_delete = FALSE`;
        const changes = await dbRun(update, [row.name, row.kana, row.mail, fcno]);
        if(changes>0)
            return true;
        else
            return false;
    });
    return rsult;
}

/** FCNO指定でメンバーを論理削除する */
const deleteMemberByFcno = async(fcno: string):Promise<boolean>=>{
    const rsult = await transactionBase(async ():Promise<boolean>=>{
        const update = 
                `UPDATE cards SET soft_delete = TRUE
                 WHERE fcno = ? AND soft_delete = FALSE`;
        const changes = await dbRun(update, [fcno]);
        if(changes>0)
            return true;
        else
            return false;
    });
    return rsult;
}

export const memberListPageServiceMethods = {
    getMemberByFcno: getMemberByFcno,
    getMembers: getMembers,
    addMember: addMember,
    updateMemberByFcno: updateMemberByFcno,
    deleteMemberByFcno: deleteMemberByFcno,
}