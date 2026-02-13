import electron from 'electron';
const ipcMain = electron.ipcMain;
import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { HistoriesMemberRow } from '@/db/histories/historiesRow';

import * as IpcServices from '@/channel/ipcService';

import { historiesPageServiceMethods } from './historiesPageServiceMethods';
const methods = historiesPageServiceMethods;
export function ipcMainHistoriesListPagePage() {
    const channel = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
    const replyChannel = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;
    ipcMain.on(channel, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        // IDMが紐づいたメンバーを取得する
        if( command == methods.getHistoriesByDate.name ){
            const date:Date = args[0];
            const rows: HistoriesMemberRow[] = await methods.getHistoriesByDate(date);
            event.reply(replyChannel, rows);
            return;            
        }
        logger.error(`comman is not match =(${command})`)
    });
}