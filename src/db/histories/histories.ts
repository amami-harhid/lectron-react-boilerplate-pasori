
import sqlite from 'sqlite3';
import { Logger } from '../../log/logger';
import { HistoriesRow, HistoriesCardRow } from "./historiesRow";
import { Cards } from '../cards/cards';
import { type Exec, exec } from "../dbCommon";
import * as DateUtils from '../../utils/dateUtils';
const logger = new Logger();

/*
const methodNames = [
    'createTable',
    'deleteByIdm',
    'deleteHistoriesByFcno',
    'dropTable',
    'insert',
    'selectAll',
    'selectByDate',
    'selectRowByFcnoDate',
    'selectInRoomByFcnoDate',
    'updateYesterdayToOutroom',
    'setInRoomByFcnoIdm',
    'setOutRoomByFcnoIdm',

] as const

type TMethodNames = typeof methodNames[number]
*/
export const HistoriesDBObj:{[key:string]: sqlite.Database|undefined} = {
    db: undefined,
}
export const Histories = {
    createTable: 
        async function():Promise<number>{
            const query = `
                CREATE TABLE IF NOT EXISTS histories (
                    [id] integer primary key autoincrement,
                    [fcno] text,
                    [idm] text,
                    [in_room] false,
                    [date_in] date,
                    [date_out] date,
                    [date_time] datetime
                )`;
            return exec.run(query);
        },
    deleteByIdm:
        async function(idm:string):Promise<number>{
            const query = `DELETE FROM histories WHERE idm = ?`;
            return exec.run(query,[idm]);
        },
    deleteHistoriesByFcno:
        async function(fcno:string):Promise<number>{
            const query = `DELETE FROM histories WHERE fcno = ?`;
            return exec.run(query,[fcno]);
        },
    dropTable:
        async function():Promise<number>{
            const query = `DROP TABLE IF EXISTS histories`;
            return exec.run(query);
        },
    insert:
        async function(fcno:string, idm:string):Promise<number>{
            const query =
                `INSERT INTO histories
                 (fcno, idm, in_room, date_in, date_out, date_time)
                 VALUES(?, ?, TRUE, date('now', 'localtime'), '', datetime('now', 'localtime'))`;
            return exec.run(query,[fcno, idm]);
        },
    selectAll:
        async function():Promise<HistoriesRow[]>{
            const query = `SELECT * FROM histories ORDER BY date_in, fcno ASC`;
            return exec.all<HistoriesRow>(query);
        },
    /** 指定日に入室した履歴を全員分取得する */ 
    selectByDate:
        async function(date:Date):Promise<HistoriesCardRow[]>{
            const query =
                `SELECT H.*,C.name,C.kana,C.mail FROM histories AS H
                 LEFT OUTER JOIN cards AS C
                 WHERE H.fcno = C.fcno AND H.idm = C.idm
                 AND H.date_in = date(?)
                 ORDER BY fcno ASC`;
            const date_str = DateUtils.dateToSqlite3Date(date);
            return exec.all<HistoriesCardRow>(query, [date_str]);
        },
    /** 指定日に入室した履歴のうち、指定したFCNOのレコード（１個）を取得する */
    selectRowByFcnoDate:
        async function(fcno:string, date:Date):Promise<HistoriesCardRow>{
            const query =
                `SELECT H.*,C.name,C.kana,C.mail FROM histories AS H
                 LEFT OUTER JOIN cards AS C
                 WHERE H.fcno = ? AND H.fcno = C.fcno AND H.idm = C.idm
                 AND H.in_room = C.in_room AND date_in = date(?)`;
            const date_str = DateUtils.dateToSqlite3Date(date);
            return exec.get<HistoriesCardRow>(query, [fcno, date_str]);
        },
    /** 指定日に入室済（退室含む）の履歴のうち、指定したFCNOのレコード（１個）を取得する */
    selectInRoomByFcnoDate:
        async function(fcno:string, date:Date):Promise<HistoriesCardRow>{
            const query =
                `SELECT H.*,C.name,C.kana,C.mail FROM histories AS H
                 LEFT OUTER JOIN cards AS C
                 WHERE H.fcno = ? AND H.fcno = C.fcno AND H.idm = C.idm
                 AND date_in = date(?)`;
            const date_str = DateUtils.dateToSqlite3Date(date);
            return exec.get<HistoriesCardRow>(query, [fcno, date_str]);
        },
    /** 現在日の前日に入室して 退室していないレコードを「退室」にする */
    updateYesterdayToOutroom:
        async function(): Promise<number>{
            const query =
                `UPDATE histories SET in_room = FALSE, date_out = date(?)
                 WHERE in_room = TRUE AND date_in = date(?)`;
            const toDay = new Date();
            const yesterday_date = DateUtils.getShiftedDate(toDay, -1);
            const yesterday_date_str = DateUtils.dateToSqlite3Date(yesterday_date);
            return exec.run(query, [yesterday_date_str, yesterday_date_str]);
        },
    /** 履歴更新( 入室にする ) */
    setInRoomByFcnoIdm:
        async function(fcno:string, idm:string) : Promise<number>{
            console.log('setInRoomByFcnoIdm start')
            const today = new Date();
            const activeCard = await Cards.selectRowByFcno(fcno);
            if( activeCard == undefined) {
                logger.error('setInRoomByFcnoIdm activeCard=', activeCard);
                return 0;
            }
            const in_room_history = await Histories.selectInRoomByFcnoDate(fcno, today);
            if(in_room_history == undefined) {
                console.log('setInRoomByFcnoIdm insert')
                // 一度も入室していないとき
                const insertCount = await Histories.insert(fcno, idm);
                console.log('setInRoomByFcnoIdm insert done')
                console.log('setInRoomByFcnoIdm fcno, idm, insertCount=', fcno, idm, insertCount);
                return insertCount;
            }else{
                console.log('setInRoomByFcnoIdm update')
                // 入室している（退室しているときも含む）
                const query =
                    `UPDATE histories
                     SET in_room = TRUE, date_out = ''
                     WHERE fcno = ? AND idm = ? AND date_in = date(?)`;
                const todayStr = DateUtils.dateToSqlite3Date(today);
                const updateCount = exec.run(query, [fcno, idm, todayStr]);
                console.log('setInRoomByFcnoIdm update done')
                console.log('setInRoomByFcnoIdm fcno, idm, updateCount=', fcno, idm, updateCount);
                return updateCount;
            }
        },
    /** 履歴更新( 退室にする ) */
    setOutRoomByFcnoIdm:
        async function(fcno:string, idm:string) : Promise<number>{
            console.log('setOutRoomByFcnoIdm start')
            const today = new Date();
            const activeCard = await Cards.selectRowByFcno(fcno);
            if( activeCard == undefined) {
                logger.debug('setInRoomByFcnoIdm activeCard=', activeCard);
                return 0;
            }
            const in_room_history = await Histories.selectInRoomByFcnoDate(fcno, today);
            if(in_room_history) {
                // 入室している（退室しているときも含む）
                const query =
                    `UPDATE histories
                     SET in_room = FALSE, date_out = date(?)
                     WHERE fcno = ? AND idm = ? AND date_in = date(?)`;
                const todayStr = DateUtils.dateToSqlite3Date(today);
                logger.debug('todayStr=',todayStr)
                return exec.run(query, [todayStr, fcno, idm, todayStr]);
            }else{
                return 0;
            }
        },  
} as const;