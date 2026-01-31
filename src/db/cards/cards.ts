
import sqlite from 'sqlite3';
import { CardRow } from "./cardRow";
import { exec } from "../dbCommon";
export const createTable = (db:sqlite.Database):Promise<number> => {
    const query = `
        CREATE TABLE IF NOT EXISTS cards (
            [id] integer primary key autoincrement,
            [fcno] text UNIQUE,
            [name] text,
            [kana] text,
            [mail] text, 
            [in_room] boolean, 
            [idm] text, 
            [soft_delete] boolean,
            [date_time] datetime
        )
    `;
    return exec.run(db, query);
};

export const deleteByFcno = (db:sqlite.Database, fcno:string):Promise<number> => {
    const query = `UPDATE cards SET soft_delete = TRUE WHERE fcno = ? AND soft_delete = FALSE`;
    return exec.run(db, query, [fcno]);
};

export const deletePhisycalByFcno = (db:sqlite.Database, fcno:string):Promise<number> => {
    // 論理削除フラグが ON(論理削除)のレコードのみを削除する
    const query = `DELETE FROM cards WHERE fcno = ? AND soft_delete = TRUE`;
    return exec.run(db, query, [fcno]);
};

export const dropTable = (db:sqlite.Database, ):Promise<number> => {
    const query = `DROP TABLE IF EXISTS cards`;
    return exec.run(db, query);
};

export const insert = (db:sqlite.Database, data:CardRow): Promise<number> => {
    const query = `INSERT INTO cards
            (fcno, name, kana, mail, in_room, idm, soft_delete, date_time)
            VALUES (?, ?, ?, ?, ?, ?, FALSE, datetime('now', 'localtime'))`;
    return exec.run(db, query,[
            data.fcno,
            data.name,
            data.kana,
            data.mail,
            data.in_room,
            data.idm,            
        ]
    );
};

export const recoveryByFcno = (db:sqlite.Database, fcno:string):Promise<number> => {
    const query = 
        `UPDATE cards SET soft_delete = FALSE, date_time = datetime('now', 'localtime') 
        WHERE fcno = ? AND soft_delete = TRUE`;
    return exec.run(db, query, [fcno]);
};

export const releaseIdmByFcno = (db:sqlite.Database, fcno:string):Promise<number> => {
    const query = 
        `UPDATE cards SET idm = '', date_time = datetime('now', 'localtime') 
        WHERE fcno=? AND soft_delete = FALSE`;
    return exec.run(db, query, [fcno]);
}


export const selectAll = (db:sqlite.Database):Promise<CardRow[]> => {
    const query = `SELECT * FROM cards WHERE soft_delete = FALSE BY kana ASC`;
    return exec.all<CardRow>(db, query);
}

export const selectRowByIdm = (db:sqlite.Database, idm:string):Promise<CardRow> => {
    const query = `SELECT * FROM cards WHERE idm = ? AND soft_delete = FALSE`;
    return exec.get<CardRow>(db, query, [idm]);
}

export const selectRowByFcno = (db:sqlite.Database, fcno:string):Promise<CardRow> => {
    const query = `SELECT * FROM cards WHERE fcno = ? AND soft_delete = FALSE`;
    return exec.get<CardRow>(db, query, [fcno]);
}

export const updatePersonalDataByFcno = (db:sqlite.Database, fcno:string, data:CardRow):Promise<number> => {
    const query = `UPDATE cards 
            SET name = ?, kana = ?, mail = ?, 
                date_time = datetime('now', 'localtime') 
            WHERE fcno = ? AND soft_delete = FALSE`;
    return exec.run(db, query, [data.name, data.kana, data.mail, fcno]);
}

export const updateInRoomByFcno = (db:sqlite.Database, fcno:string, in_room:boolean): Promise<number> => {
    const query = `UPDATE cards 
            SET in_room = ?, 
            date_time = datetime('now', 'localtime') 
            WHERE fcno = ? AND soft_delete = FALSE`;
    return exec.run(db, query, [in_room, fcno]);
}
