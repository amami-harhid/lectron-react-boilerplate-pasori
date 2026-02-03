import { ipcMain } from "electron";
import * as IpcServices from '../channel/ipcService';
export type Channels = IpcServices.IpcChannelValOfService;
import { db } from "./db";
import * as Cards from "./cards/cards";
import * as Histories from "./histories/histories";
import { CardRow } from "./cards/cardRow";
import { HistoriesRow } from "./histories/historiesRow";
import { HistoriesCardRow } from "./histories/historiesRow";

// RENDERER --> MAIN -->RENDERERのDB通信
export function ipcMainSqliteBridge() {
    const channel = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
    const replyChannel = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;
    ipcMain.on(channel, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        if(command == Cards.cards_selectAll.name){
            const fcno = args[0];
            const rows:CardRow[] = await Cards.cards_selectAll(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.cards_selectRowByFcno.name){
            const fcno = args[0];
            const row:CardRow = await Cards.cards_selectRowByFcno(db, fcno);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Cards.cards_selectRowByIdm.name){
            const idm = args[0];
            const row:CardRow = await Cards.cards_selectRowByIdm(db, idm);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Cards.cards_selectRowsEmptyIdm.name){
            const rows:CardRow[] = await Cards.cards_selectRowsEmptyIdm(db);
            console.log(rows);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.cards_deleteByFcno.name){
            const fcno = args[0];
            const count:number = await Cards.cards_deleteByFcno(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.cards_insert.name){
            const row:CardRow = args[0];
            const count:number = await Cards.cards_insert(db, row);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.cards_linkIdmByFcno.name){
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Cards.cards_linkIdmByFcno(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.cards_releaseIdmByFcno.name){
            const fcno:string = args[0];
            const count:number = await Cards.cards_releaseIdmByFcno(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.cards_updateInRoomByFcno.name){
            const fcno:string = args[0];
            const in_room: boolean = args[1];
            const count:number = await Cards.cards_updateInRoomByFcno(db, fcno, in_room);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.cards_updatePersonalDataByFcno.name){
            const fcno:string = args[0];
            const row: CardRow = args[1];
            const count:number = await Cards.cards_updatePersonalDataByFcno(db, fcno, row);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.hist_insert.name){
            const fcno:string = args[0];
            const idm: string = args[1];
            const count:number = await Histories.hist_insert(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.hist_selectAll.name){
            const rows:HistoriesRow[] = await Histories.hist_selectAll(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Histories.hist_selectByDate.name){
            const date:Date = args[0];
            const rows:HistoriesRow[] = await Histories.hist_selectByDate(db, date);
            console.log(rows);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Histories.hist_selectRowByFcnoDate.name){
            const fcno:string = args[0]
            const date:Date = args[1];
            const row:HistoriesRow = await Histories.hist_selectRowByFcnoDate(db, fcno, date);
            console.log(row);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Histories.hist_selectInRoomByFcnoDate.name){
            const fcno:string = args[0];
            const date:Date = args[1];
            const row:HistoriesCardRow = await Histories.hist_selectInRoomByFcnoDate(db, fcno, date);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Histories.hist_setInRoomByFcnoIdm.name){
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Histories.hist_setInRoomByFcnoIdm(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.hist_setOutRoomByFcnoIdm.name) {
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Histories.hist_setOutRoomByFcnoIdm(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.hist_updateYesterdayToOutroom.name){
            const count:number = await Histories.hist_updateYesterdayToOutroom(db);
            event.reply(replyChannel, count);
            return;
        }
        console.log('comman is not match ', command)
    });
}
