export const Query = {
    createTable :  
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
        )`,
    

    deleteByFcno :
        `UPDATE cards SET soft_delete = TRUE WHERE fcno = ? AND soft_delete = FALSE`,
    
    deletePhisycalByFcno:
        // 論理削除フラグが ON(論理削除)のレコードのみを削除する
        `DELETE FROM cards WHERE fcno = ? AND soft_delete = TRUE`,
    dropTable:  
        `DROP TABLE IF EXISTS cards`,
    
    insert: `INSERT INTO cards
            (fcno, name, kana, mail, in_room, idm, soft_delete, date_time)
            VALUES (?, ?, ?, ?, ?, ?, FALSE, datetime('now', 'localtime'))`,
    recoveryByFcno:
        `UPDATE cards SET soft_delete = FALSE, date_time = datetime('now', 'localtime') 
        WHERE fcno = ? AND soft_delete = TRUE`,

    releaseIdmByFcno:
        `UPDATE cards SET idm = '', date_time = datetime('now', 'localtime') 
        WHERE fcno=? AND soft_delete = FALSE`,

    selectAllCardRows:
        `SELECT * FROM cards WHERE soft_delete = FALSE BY kana ASC`,

    selectCardsRowByIdm:
        `SELECT * FROM cards WHERE idm = ? AND soft_delete = FALSE`,

    selectCardsRowByFcno:
        `SELECT * FROM cards WHERE fcno = ? AND soft_delete = FALSE`,

    updatePersonalDataByFcno:
        `UPDATE cards 
            SET name = ?, kana = ?, mail = ?, 
                date_time = datetime('now', 'localtime') 
            WHERE fcno = ? AND soft_delete = FALSE`,

    updateInRoomByFcno:
        `UPDATE cards 
            SET in_room = ?, 
            date_time = datetime('now', 'localtime') 
            WHERE fcno = ? AND soft_delete = FALSE`,
}
