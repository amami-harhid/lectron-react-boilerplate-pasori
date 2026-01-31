
import sqlite from 'sqlite3';
import { HistoriesRow, HistoriesCardRow } from "./historiesRow";
import * as Cards from '../cards/cards';
import { exec } from "../dbCommon";
import * as DateUtils from '../../utils/dateUtils';
export const createTable = (db:sqlite.Database):Promise<number> => {
    const query = `
        CREATE TABLE IF NOT EXISTS histories (
            [id] integer primary key autoincrement, 
            [idm] text,
            [fcno] text,
            [in_room] false,
            [date_in] date,
            [date_out] date,
            [date_time] datetime
        )
    `;
    return exec.run(db, query);
};
export const deleteByIdm = (db:sqlite.Database, idm:string):Promise<number> => {
    const query = `DELETE FROM histories WHERE idm = ?`;
    return exec.run(db, query,[idm]);
};
export const deleteHistoriesByFcno = (db:sqlite.Database, fcno:string):Promise<number> => {
    const query = `DELETE FROM histories WHERE fcno = ?`;
    return exec.run(db, query,[fcno]);
};
export const dropTable = (db:sqlite.Database, ):Promise<number> => {
    const query = `DROP TABLE IF EXISTS histories`;
    return exec.run(db, query);
}

export const insert = (db:sqlite.Database, fcno:string, idm:string ):Promise<number> => {
    const query = 
    `INSERT INTO histories 
    (idm, fcno, in_room, date_in, date_out, date_time)
    VALUES(?, ?, TRUE, date('now', 'localtime'), '', datetime('now', 'localtime'))`;
    return exec.run(db, query,[idm, fcno]);
}

export const selectAll = (db:sqlite.Database):Promise<HistoriesRow[]> => {
    const query = `SELECT * FROM histories ORDER BY date_in, fc_no ASC`;
    return exec.all<HistoriesRow>(db, query);
}

// 指定日に入室した履歴を全員分取得する
export const selectByDate = (db:sqlite.Database, date:Date):Promise<HistoriesCardRow[]> => {
    const query = 
        `SELECT H.*,C.name,C.kana,C.mail FROM histories AS H
         LEFT OUTER JOIN cards AS C
         WHERE H.fcno = C.fcno AND H.idm = C.idm 
         AND H.in_room = C.in_room AND H.date_in = date(?) 
         ORDER BY fc_no ASC`;
    const date_str = DateUtils.dateToSqlite3Date(date);
    return exec.all<HistoriesCardRow>(db, query, [date_str]);
}

// 指定日に入室した履歴のうち、指定したFCNOのレコード（１個）を取得する
export const selectByFcnoDate = (db:sqlite.Database, fcno:string, date:Date):Promise<HistoriesCardRow> => {
    const query = 
        `SELECT H.*,C.name,C.kana,C.mail FROM histories AS H
         LEFT OUTER JOIN cards AS C
        WHERE H.fcno = ? AND H.fcno = C.fcno AND H.idm = C.idm 
        AND H.in_room = C.in_room AND date_in = date(?)`;
    const date_str = DateUtils.dateToSqlite3Date(date);
    return exec.get<HistoriesCardRow>(db, query, [fcno, date_str]);
}

// 指定日に入室済（退室含む）の履歴のうち、指定したFCNOのレコード（１個）を取得する
export const selectInRoomByFcnoDate = (db:sqlite.Database, fcno:string, date:Date):Promise<HistoriesCardRow> => {
    const query = 
        `SELECT H.*, FROM histories AS H
         LEFT OUTER JOIN cards AS C
        WHERE H.fcno = ? AND H.fcno = C.fcno AND H.idm = C.idm 
        AND date_in = date(?)`;
    const date_str = DateUtils.dateToSqlite3Date(date);
    return exec.get<HistoriesCardRow>(db, query, [fcno, date_str]);
}

// 現在日の前日に入室して 退室していないレコードを「退室」にする
export const updateYesterdayToOutroom = (db:sqlite.Database): Promise<number> => {
    const query = 
    `UPDATE histories SET in_room = FALSE, date_out = date(?) 
    WHERE in_room = TRUE AND date_in = date(?)`;
    const toDay = new Date();
    const yesterday_date = DateUtils.getShiftedDate(toDay, -1);
    const yesterday_date_str = DateUtils.dateToSqlite3Date(yesterday_date);
    return exec.run(db, query, [yesterday_date_str, yesterday_date_str]);
}

// 入室にする
export const setInRoomByFcnoIdm = async (db:sqlite.Database, fcno:string, idm:string) : Promise<number> => {
    const today = new Date();
    const activeCard = await Cards.selectCardsByFcno(db, fcno);
    if( activeCard == undefined) {
        return 0;
    }
    const in_room_history = await selectInRoomByFcnoDate(db, fcno, today);
    if(in_room_history == undefined) {
        // 一度も入室していないとき
        const insertCount = await insert(db, fcno, idm);
        return insertCount;
    }else{
        // 入室している（退室しているときも含む）
        const query = 
        `UPDATE histories SET in_room = TRUE, date_out = '' WHERE fcno = ? AND idm = ? AND date_in = date(?)`;
        const todayStr = DateUtils.dateToSqlite3Date(today);
        return exec.run(db, query, [fcno, idm, todayStr]);
    }
}