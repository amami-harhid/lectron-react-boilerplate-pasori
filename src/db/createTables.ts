import * as DotEnv from 'dotenv';
DotEnv.config();
import { envIs } from '@/main/util';
import Sqlite from 'sqlite3';
import { DatabaseRef } from './dbReference';
import { Cards } from '../db/cards/cards';
import { Histories } from '../db/histories/histories';
import { CardRow } from '../db/cards/cardRow';

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


export const createTables = async(db: Sqlite.Database) => {
    DatabaseRef.db = db;
    if( envIs.development ){
        console.log('DEBUG DATA SHIKOMI!')
        await Cards.dropTable();
        await Histories.dropTable();
    }
    await Cards.createTable();
    await Histories.createTable();

    if( envIs.development ){
        console.log('DEBUG DATA SHIKOMI!')
        for(const data of cardsDatas) {
            await Cards.insert(data);
            //await Histories.hist_setInRoomByFcnoIdm(db, data.fcno, data.idm);
            //await Cards.cards_updateInRoomByFcno(db, data.fcno, true);
        }
    }

}
