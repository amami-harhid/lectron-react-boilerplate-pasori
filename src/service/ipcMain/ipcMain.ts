import { ipcMain } from "electron";
import { Logger } from "@/log/logger";
const logger = new Logger();
import * as IpcServices from '@/channel/ipcService';
import { type Exec } from "@/db/dbCommon";
import { Cards } from "@/db/cards/cards";
import { Histories } from "@/db/histories/histories";
import { ipcMainTopPage } from '../ipcMain/topPageService';
import { ipcMainMemberListPage } from "./memberListService";
export type Channels = IpcServices.IpcChannelValOfService;
// RENDERER --> MAIN -->RENDERERのDB通信
export function ipcMainSqliteBridge() {
    ipcMainTopPage();
    ipcMainMemberListPage();
    console.log('ipcMainSqliteBridge/ ipcMainMemberListPage');
    const channel = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
    const replyChannel = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;
    ipcMain.on(channel, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        if( command in Cards ){
            const C:{[key:string]: Exec} = Cards;
            const m = C[command];
            const v = await m(...args);
            event.reply(replyChannel, v);
            return;
        }
        else if(command in Histories){
            const H:{[key:string]: Exec} = Histories;
            const m = H[command];
            const v = await m(...args);
            event.reply(replyChannel, v);
            return;
        }
        logger.error(`comman is not match =(${command})`)
    });
};

