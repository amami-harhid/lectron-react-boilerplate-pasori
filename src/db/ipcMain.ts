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
        logger.info('command=', command)
        logger.info('params=', args);
        logger.info('Cards.cards_selectAll.name=', Cards.selectAll.name);
        if(command == Cards.selectAll.name){
            logger.info('[1] command=', command)
            const rows:CardRow[] = await Cards.selectAll.exec(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.selectRowByFcno.name){
            logger.info('[2] command=', command)
            const fcno = args[0];
            const row:CardRow = await Cards.selectRowByFcno.exec(db, fcno);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Cards.selectRowByIdm.name){
            logger.info('[3] command=', command)
            const idm = args[0];
            const row:CardRow = await Cards.selectRowByIdm.exec(db, idm);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Cards.selectRowsEmptyIdm.name){
            logger.info('[4] command=', command)
            const rows:CardRow[] = await Cards.selectRowsEmptyIdm.exec(db);
            console.log(rows);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Cards.deleteByFcno.name){
            logger.info('[5] command=', command)
            const fcno = args[0];
            const count:number = await Cards.deleteByFcno.exec(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.insert.name){
            logger.info('[6] command=', command)
            const row:CardRow = args[0];
            const count:number = await Cards.insert.exec(db, row);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.linkIdmByFcno.name){
            logger.info('[7] command=', command)
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Cards.linkIdmByFcno.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.releaseIdmByFcno.name){
            logger.info('[8] command=', command)
            const fcno:string = args[0];
            const count:number = await Cards.releaseIdmByFcno.exec(db, fcno);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.updateInRoomByFcno.name){
            logger.info('[9] command=', command)
            const fcno:string = args[0];
            const in_room: boolean = args[1];
            const count:number = await Cards.updateInRoomByFcno.exec(db, fcno, in_room);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Cards.updatePersonalDataByFcno.name){
            logger.info('[10] command=', command)
            const fcno:string = args[0];
            const row: CardRow = args[1];
            const count:number = await Cards.updatePersonalDataByFcno.exec(db, fcno, row);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.insert.name){
            logger.info('[11] command=', command)
            const fcno:string = args[0];
            const idm: string = args[1];
            const count:number = await Histories.insert.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.selectAll.name){
            logger.info('[12] command=', command)
            const rows:HistoriesRow[] = await Histories.selectAll.exec(db);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Histories.selectByDate.name){
            logger.info('[13] command=', command)
            const date:Date = args[0];
            const rows:HistoriesRow[] = await Histories.selectByDate.exec(db, date);
            console.log(rows);
            event.reply(replyChannel, rows);
            return;
        }
        else if(command == Histories.selectRowByFcnoDate.name){
            logger.info('[14] command=', command)
            const fcno:string = args[0]
            const date:Date = args[1];
            const row:HistoriesRow = await Histories.selectRowByFcnoDate.exec(db, fcno, date);
            console.log(row);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Histories.selectInRoomByFcnoDate.name){
            logger.info('[15] command=', command)
            const fcno:string = args[0];
            const date:Date = args[1];
            const row:HistoriesCardRow = await Histories.selectInRoomByFcnoDate.exec(db, fcno, date);
            event.reply(replyChannel, row);
            return;
        }
        else if(command == Histories.setInRoomByFcnoIdm.name){
            logger.info('[16] command=', command)
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Histories.setInRoomByFcnoIdm.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.setOutRoomByFcnoIdm.name) {
            logger.info('[17] command=', command)
            const fcno:string = args[0];
            const idm:string = args[1];
            const count:number = await Histories.setOutRoomByFcnoIdm.exec(db, fcno, idm);
            event.reply(replyChannel, count);
            return;
        }
        else if(command == Histories.updateYesterdayToOutroom.name){
            logger.info('[18] command=', command)
            const count:number = await Histories.updateYesterdayToOutroom.exec(db);
            event.reply(replyChannel, count);
            return;
        }
        logger.info(`comman is not match =(${command})`)
    });
}
