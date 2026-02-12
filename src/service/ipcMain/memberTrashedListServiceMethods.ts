import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { CardRow } from '@/db/cards/cardRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

/** 論理削除されたメンバーを取得する */
const getTrashedMembers = async (): Promise<CardRow[]> => {
  const query = `SELECT * FROM cards WHERE soft_delete = TRUE`;
  const rows: CardRow[] = await dbAll(query);
  return rows;
};
/** FCNO指定で論理削除を復活させる */
const setRecorverMemberByFcno = async (fcno:string): Promise<boolean> => {
  const query =
    `UPDATE cards SET soft_delete = FALSE, date_time = datetime('now', 'localtime') WHERE fcno = ? AND soft_delete = TRUE`;
  const changes = await dbRun(query, [fcno]);
  if( changes > 0 )
    return true;
  else
    return false;
}

/** 論理削除されたメンバーと紐づく履歴を完全削除する */
const deleteCompletelyByFcno = async (fcno:string): Promise<boolean> => {
  const rsult = await transactionBase(async ()=>{
    const deleteCards =
      `DELETE FROM cards WHERE fcno = ? AND soft_delete = TRUE`;
    const c_changes = await dbRun(deleteCards, [fcno]);
    if(c_changes > 0) {
      const deleteHistories =
        `DELETE FROM histories WHERE fcno = ?`;
      const h_changes = await dbRun(deleteHistories, [fcno]);
      if( h_changes > 0)
        return true;
      else
        return false;
    }else{
      throw new Error();
    }
  });
  return rsult;
};

export const memberTrashedListServiceMethods = {
  getTrashedMembers: getTrashedMembers,
  setRecorverMemberByFcno: setRecorverMemberByFcno,
  deleteCompletelyByFcno: deleteCompletelyByFcno,
} as const;
