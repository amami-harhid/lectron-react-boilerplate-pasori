import sqlite from 'sqlite3';
import { IpcRendererEvent } from 'electron';
import * as Cards from './cards/cards';
import { CardRow } from './cards/cardRow';

export const methods = {
    createTable: Cards.createTable,
    deleteByFcno: (e:IpcRendererEvent,db:sqlite.Database,fcno:string)=> Cards.deleteByFcno(db,fcno),
    deletePhisycalByFcno: (e:IpcRendererEvent,db:sqlite.Database, fcno:string)=>Cards.deletePhisycalByFcno(db,fcno),
    dropTable: (e:IpcRendererEvent,db:sqlite.Database)=>Cards.dropTable(db),
    insert: (e:IpcRendererEvent,db:sqlite.Database,data:CardRow)=>Cards.insert(db,data),
    recoveryByFcno: (e:IpcRendererEvent,db:sqlite.Database,fcno:string)=>Cards.recoveryByFcno(db,fcno),
    releaseIdmByFcno: (e:IpcRendererEvent,db:sqlite.Database,fcno:string)=>Cards.releaseIdmByFcno(db,fcno),
    selectAll: (e:IpcRendererEvent,db:sqlite.Database)=>Cards.selectAll(db),
    selectCardsByFcno: (e:IpcRendererEvent,db:sqlite.Database,fcno:string)=>Cards.selectCardsByFcno(db,fcno),
    selectCardsByIdm: (e:IpcRendererEvent,db:sqlite.Database,idm:string)=>Cards.selectCardsByIdm(db,idm),
    updateInRoomByFcno: (e:IpcRendererEvent,db:sqlite.Database,fcno:string, in_room:boolean)=>Cards.updateInRoomByFcno(db,fcno, in_room),
} as const;

type methodKeys = keyof typeof methods;
const _keysArr:methodKeys[] = []
for(const key in methods){
    const _key = key as unknown as methodKeys;
    _keysArr.push(_key);
}
export const KeysArr = [..._keysArr];