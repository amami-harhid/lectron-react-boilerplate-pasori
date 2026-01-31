import sqlite from 'sqlite3';
import { IpcRendererEvent } from 'electron';
import * as Histories from './histories/histories';

export const methods = {
    createTable: (e:IpcRendererEvent,db:sqlite.Database)=> Histories.createTable(db),
    deleteByIdm: (e:IpcRendererEvent,db:sqlite.Database, idm:string)=> Histories.deleteByIdm(db,idm),
    deleteHistoriesByFcno: (e:IpcRendererEvent,db:sqlite.Database, fcno:string)=> Histories.deleteHistoriesByFcno(db,fcno),
    dropTable: (e:IpcRendererEvent,db:sqlite.Database)=> Histories.dropTable(db),
    insert: (e:IpcRendererEvent,db:sqlite.Database,fcno:string,idm:string)=> Histories.insert(db,fcno, idm),
    selectAll: (e:IpcRendererEvent,db:sqlite.Database)=> Histories.selectAll(db),
    selectByDate: (e:IpcRendererEvent,db:sqlite.Database,date:Date)=> Histories.selectByDate(db,date),
    selectByFcnoDate: (e:IpcRendererEvent,db:sqlite.Database,fcno:string,date:Date)=> Histories.selectByFcnoDate(db,fcno,date),
    selectInRoomByFcnoDate: (e:IpcRendererEvent,db:sqlite.Database,fcno:string,date:Date)=> Histories.selectInRoomByFcnoDate(db,fcno,date),
    setInRoomByFcno: (e:IpcRendererEvent,db:sqlite.Database,fcno:string,idm:string)=> Histories.setInRoomByFcnoIdm(db,fcno,idm),
    updateYesterdayToOutroom: (e:IpcRendererEvent,db:sqlite.Database)=> Histories.updateYesterdayToOutroom(db),
} as const;

type methodKeys = keyof typeof methods;
const _keysArr:methodKeys[] = []
for(const key in methods){
    const _key = key as unknown as methodKeys;
    _keysArr.push(_key);
}
export const KeysArr = [..._keysArr];