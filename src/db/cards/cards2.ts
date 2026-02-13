
import { CardRow } from "./cardRow2";
import { exec } from "../dbCommon";

export const Cards = {
    createTable: 
        async function(cb:CallableFunction):Promise<number>{
            const query = 
            `CREATE TABLE IF NOT EXISTS cards (
                [id] integer primary key autoincrement,
                [fcno] text UNIQUE,
                [name] text,
                [kana] text,
                [mail] text,
                [in_room] boolean,
                [idm] text,
                [soft_delete] boolean,
                [date_time] datetime
            )`;
            return exec.run(query, cb);
        },
    deleteByFcno: 
        function(fcno:string, cb:CallableFunction):Promise<number> {
            const query = `UPDATE cards SET soft_delete = TRUE WHERE fcno = ? AND soft_delete = FALSE`;
            return exec.run(query, cb, [fcno]);
        },
    deletePhisycalByFcno:
        async function(fcno:string, cb:CallableFunction):Promise<number> {
            // 論理削除フラグが ON(論理削除)のレコードのみを削除する
            const query = `DELETE FROM cards WHERE fcno = ? AND soft_delete = TRUE`;
            return exec.run(query, cb, [fcno]);
        },
    dropTable:
        async function dropTable(cb:CallableFunction):Promise<number>{
            const query = `DROP TABLE IF EXISTS cards`;
            return exec.run(query, cb);
        },
    insert:
        async function(data:CardRow, cb:CallableFunction): Promise<number>{
            const query = `INSERT INTO cards
                (fcno, name, kana, mail, in_room, idm, soft_delete, date_time)
                VALUES (?, ?, ?, ?, ?, ?, FALSE, datetime('now', 'localtime'))`;
            return exec.run(query, cb, [
                data.fcno,
                data.name,
                data.kana,
                data.mail,
                data.in_room,
                data.idm,
            ]);
        },
    recoveryByFcno:
        async function(fcno:string, cb:CallableFunction):Promise<number>{
            const query =
                `UPDATE cards SET soft_delete = FALSE, date_time = datetime('now', 'localtime')
                 WHERE fcno = ? AND soft_delete = TRUE`;
            return exec.run(query, cb, [fcno]);
        },
    releaseIdmByFcno:
        async function(fcno:string, cb:CallableFunction):Promise<number>{
            const query =
                `UPDATE cards SET idm = '', date_time = datetime('now', 'localtime')
                 WHERE fcno=? AND soft_delete = FALSE`;
            return exec.run(query, cb, [fcno]);
        },
    linkIdmByFcno:
        async function(fcno:string, idm:string, cb:CallableFunction):Promise<number>{
            const query =
                `UPDATE cards SET idm = ?, date_time = datetime('now', 'localtime')
                 WHERE fcno = ? AND soft_delete = FALSE`;
            return exec.run(query, cb, [idm, fcno]);
        },
    selectAll:
        async function():Promise<CardRow[]>{
            const query = `SELECT * FROM cards WHERE soft_delete = FALSE ORDER BY kana ASC`;
            return exec.all<CardRow>(query);
        },
    selectAllSoftDeleted:
        async function():Promise<CardRow[]>{
            const query = `SELECT * FROM cards WHERE soft_delete = TRUE ORDER BY kana ASC`;
            return exec.all<CardRow>(query);
        },
    selectRowsEmptyIdm:
        async function():Promise<CardRow[]>{
            const query = `SELECT * FROM cards WHERE idm = '' AND soft_delete = FALSE ORDER BY kana ASC`;
            return exec.all<CardRow>(query);
        },
    selectRowByIdm:
        async function(idm:string):Promise<CardRow>{
            const query = `SELECT * FROM cards WHERE idm = ? AND soft_delete = FALSE`;
            return exec.get<CardRow>(query, [idm]);
        },
    selectRowByFcno:
        async function(fcno:string):Promise<CardRow>{
            const query = `SELECT * FROM cards WHERE fcno = ? AND soft_delete = FALSE`;
            return exec.get<CardRow>(query, [fcno]);
        },
    updatePersonalDataByFcno:
        async function(fcno:string, data:CardRow, cb:CallableFunction):Promise<number>{
            const query = 
                `UPDATE cards SET name = ?, kana = ?, mail = ?,
                    date_time = datetime('now', 'localtime')
                WHERE fcno = ? AND soft_delete = FALSE`;
            return exec.run(query, cb, [data.name, data.kana, data.mail, fcno]);
        },
    updateInRoomByFcno:
        async function(fcno:string, in_room:boolean, cb:CallableFunction): Promise<number>{
            const query = `UPDATE cards
                SET in_room = ?,
                date_time = datetime('now', 'localtime')
                WHERE fcno = ? AND soft_delete = FALSE`;
            return exec.run(query, cb, [in_room, fcno]);
        },
    
} as const;