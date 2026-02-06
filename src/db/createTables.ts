import * as DotEnv from 'dotenv';
DotEnv.config();

import Sqlite from 'sqlite3';
import * as Cards from '../db/cards/cards';
import * as Histories from '../db/histories/histories';
import { CardRow } from '../db/cards/cardRow';
import { HistoriesRow } from '../db/histories/historiesRow';

//---- DB TABLE INSERT DUMMY DATA
const cardsDatas:CardRow[] = [
    {
      fcno: '0001',
      idm: '',
      name: 'ひながた みなみ',
      kana: 'ヒナガタ ミナミ',
      in_room: false,
      mail: 'minami-xxx@test.com',
    },
    {
      fcno: '0002',
      idm: '',
      name: 'ジェームス 鴇田',
      kana: 'トキタ ジェームス',
      in_room: false,
      mail: 'jms-xxxx@test.com',
    },
    {
      fcno: '0003',
      idm: '',
      name: 'ジェームス 鴇田2',
      kana: 'トキタ ジェームス2',
      in_room: false,
      mail: 'jms-xxxx2@test.com',
    }

] as const;


export const createTables = async(db:Sqlite.Database) => {

    console.log('process.env.DEBUG_PROD=',process.env.DEBUG_PROD);

    if(process.env.DEBUG_PROD == 'true'){
        console.log('DEBUG DATA SHIKOMI!')
        await Cards.dropTable.exec(db);
        await Histories.dropTable.exec(db);
    }
    await Cards.createTable(db);
    await Histories.createTable(db);

    if(process.env.DEBUG_PROD == 'true'){
        console.log('DEBUG DATA SHIKOMI!')
        for(const data of cardsDatas) {
            await Cards.insert.exec(db,data);
            //await Histories.hist_setInRoomByFcnoIdm(db, data.fcno, data.idm);
            //await Cards.cards_updateInRoomByFcno(db, data.fcno, true);
        }
    }

}
