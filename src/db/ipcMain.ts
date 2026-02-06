import { ipcMain } from "electron";
import { Logger } from "../log/logger";
const logger = new Logger();
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

        if(command == Cards.selectAll.name){
            const rows:CardRow[] = await Cards.selectAll.exec(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.selectAllSoftDeleted.name) {
            const rows:CardRow[] = await Cards.selectAllSoftDeleted.exec(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.selectRowByFcno.name){
            const fcno = args[0];
            const row:CardRow = await Cards.selectRowByFcno.exec(db, fcno);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Cards.selectRowByIdm.name){
            const idm = args[0];
            const row:CardRow = await Cards.selectRowByIdm.exec(db, idm);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Cards.selectRowsEmptyIdm.name){
            const rows:CardRow[] = await Cards.selectRowsEmptyIdm.exec(db);
            console.log(rows);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.deleteByFcno.name){
            const fcno = args[0];
            const count:number = await Cards.deleteByFcno.exec(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.deletePhisycalByFcno.name){
            const fcno = args[0];
            const count:number = await Cards.deletePhisycalByFcno.exec(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.insert.name){
            const row:CardRow = args[0];
            const count:number = await Cards.insert.exec(db, row);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.linkIdmByFcno.name){
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Cards.linkIdmByFcno.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.releaseIdmByFcno.name){
            const fcno:string = args[0];
            const count:number = await Cards.releaseIdmByFcno.exec(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.recoveryByFcno.name){
            const fcno:string = args[0];
            const count:number = await Cards.recoveryByFcno.exec(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.updateInRoomByFcno.name){
            const fcno:string = args[0];
            const in_room: boolean = args[1];
            const count:number = await Cards.updateInRoomByFcno.exec(db, fcno, in_room);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.updatePersonalDataByFcno.name){
            const fcno:string = args[0];
            const row: CardRow = args[1];
            const count:number = await Cards.updatePersonalDataByFcno.exec(db, fcno, row);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.insert.name){
            const fcno:string = args[0];
            const idm: string = args[1];
            const count:number = await Histories.insert.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.selectAll.name){
            const rows:HistoriesRow[] = await Histories.selectAll.exec(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Histories.selectByDate.name){
            const date:Date = args[0];
            const rows:HistoriesRow[] = await Histories.selectByDate.exec(db, date);
            console.log(rows);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Histories.selectRowByFcnoDate.name){
            const fcno:string = args[0]
            const date:Date = args[1];
            const row:HistoriesRow = await Histories.selectRowByFcnoDate.exec(db, fcno, date);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Histories.selectInRoomByFcnoDate.name){
            const fcno:string = args[0];
            const date:Date = args[1];
            const row:HistoriesCardRow = await Histories.selectInRoomByFcnoDate.exec(db, fcno, date);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Histories.setInRoomByFcnoIdm.name){
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Histories.setInRoomByFcnoIdm.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.setOutRoomByFcnoIdm.name) {
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Histories.setOutRoomByFcnoIdm.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.updateYesterdayToOutroom.name){
            const count:number = await Histories.updateYesterdayToOutroom.exec(db);
            event.reply(replyChannel, count);
            return;
        }
        logger.error(`comman is not match =(${command})`)
    });
}
