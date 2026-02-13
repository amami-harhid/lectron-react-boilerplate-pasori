import type { MemberRow } from '@/db/members/memberRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

/** FCNO指定でメンバーを取得する */
const getMemberByFcno = async(fcno:string):Promise<MemberRow>=>{
    const query = 
        `SELECT * FROM members 
         WHERE fcno = ? AND soft_delete = FALSE`;
    const row = await dbGet<MemberRow>(query, [fcno]);
    return row;
}

/** 全メンバーを取得する */
const getMembers = async():Promise<MemberRow[]>=>{
    const selectAll =
        `SELECT * FROM members 
         WHERE soft_delete = FALSE
         ORDER BY kana ASC`;
    const rows = dbAll<MemberRow>(selectAll,[]);
    return rows;
}

/** メンバーを追加する */
const addMember = async(row: MemberRow):Promise<boolean>=>{
    const rsult = await transactionBase(async ():Promise<boolean>=>{
        const insert = `INSERT INTO members
                (fcno, name, kana, mail, soft_delete, date_time)
                VALUES (?, ?, ?, ?, FALSE, datetime('now', 'localtime'))`;
        const changes = await dbRun(insert, [row.fcno, row.name, row.kana, row.mail]);
        if(changes>0)
            return true;
        else
            return false;
    });
    return rsult;
}

/** FCNO指定でメンバー情報を更新する */
const updateMemberByFcno = async(fcno: string, row: MemberRow):Promise<boolean>=>{
    const rsult = await transactionBase(async ():Promise<boolean>=>{
        const update = `UPDATE members
                SET name = ?, kana = ?, mail = ?, date_time = datetime('now', 'localtime')
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
                `UPDATE members SET soft_delete = TRUE, date_time = datetime('now', 'localtime')
                 WHERE fcno = ? AND soft_delete = FALSE`;
        const changes = await dbRun(update, [fcno]);
        console.log('delete cards changes=',changes);
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
