import type { HistoriesMemberRow } from '@/db/histories/historiesRow';

import * as DateUtils from '../../utils/dateUtils';

import { dbAll } from './utils/serviceUtils';

/** 日付を指定して全履歴を取得する */
const getHistoriesByDate = async (date: Date):Promise<HistoriesMemberRow[]> => {
    const query =
        `SELECT H.*,M.name,M.kana,M.mail FROM histories AS H
         LEFT OUTER JOIN members AS M
         WHERE H.fcno = M.fcno
         AND H.date = date(?)
         ORDER BY fcno ASC`;
    const date_str = DateUtils.dateToSqlite3Date(date);
    const rows = await dbAll<HistoriesMemberRow>(query, [date_str]);
    return rows;
}

export const historiesPageServiceMethods = {
    getHistoriesByDate: getHistoriesByDate,
}