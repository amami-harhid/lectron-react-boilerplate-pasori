import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { CardRow } from '@/db/cards/cardRow';

import * as DateUtils from '../../utils/dateUtils';

import { dbAll } from './utils/serviceUtils';

/** 日付を指定して全履歴を取得する */
const getHistoriesByDate = async (date: Date):Promise<CardRow[]> => {
    const query =
        `SELECT H.*,C.name,C.kana,C.mail FROM histories AS H
         LEFT OUTER JOIN cards AS C
         WHERE H.fcno = C.fcno AND H.idm = C.idm
         AND H.date_in = date(?)
         ORDER BY fcno ASC`;
    const date_str = DateUtils.dateToSqlite3Date(date);
    const rows = await dbAll<CardRow>(query, [date_str]);
    return rows;
}

export const historiesPageServiceMethods = {
    getHistoriesByDate: getHistoriesByDate,
}