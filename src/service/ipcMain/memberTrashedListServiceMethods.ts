import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { CardRow } from '@/db/cards/cardRow';
import type { MemberRow } from '@/db/members/memberRow';

import { dbRun, dbAll, dbGet, transactionBase } from './utils/serviceUtils';

/** 論理削除されたメンバーを取得する */
const getTrashedMembers = async (): Promise<MemberRow[]> => {
  const query = 
      `SELECT * FROM members 
       WHERE soft_delete = TRUE`;
  const rows: MemberRow[] = await dbAll<MemberRow>(query);
  return rows;
};
/** FCNO指定で論理削除を復活させる */
const setRecorverMemberByFcno = async (fcno:string): Promise<boolean> => {
  const query =
    `UPDATE members 
     SET soft_delete = FALSE, date_time = datetime('now', 'localtime') 
     WHERE fcno = ? AND soft_delete = TRUE`;
  const changes = await dbRun(query, [fcno]);
  if( changes > 0 )
    return true;
  else
    return false;
}

/** 論理削除されたメンバーと紐づく履歴を完全削除する */
const deleteCompletelyByFcno = async (fcno:string): Promise<boolean> => {
    const rsult = await transactionBase(async ()=>{
        const deleteMemberQuery =
          `DELETE FROM members WHERE fcno = ? AND soft_delete = TRUE
           DELETE FROM idms WHERE fcno = ?
           DELETE FROM histories WHERE fcno = ?`;
        const changes = await dbRun(deleteMemberQuery, [fcno, fcno, fcno]);
        if(changes > 0) {
            return true;
        }else{
            return false;
        }
    });
    return rsult;
};

export const memberTrashedListServiceMethods = {
  getTrashedMembers: getTrashedMembers,
  setRecorverMemberByFcno: setRecorverMemberByFcno,
  deleteCompletelyByFcno: deleteCompletelyByFcno,
} as const;
