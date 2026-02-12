import electron from 'electron';
const ipcMain = electron.ipcMain;
import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { CardRow } from '@/db/cards/cardRow';

import * as IpcServices from '@/channel/ipcService';

import { topPageServiceMethods } from './topPageServiceMethods';
const methods = topPageServiceMethods;
export function ipcMainTopPage() {
    const channel = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
    const replyChannel = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;
    ipcMain.on(channel, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        // IDMが紐づいたメンバーを取得する
        if( command == methods.getMemberByIdm.name ){
            const idm:string = args[0];
            const row: CardRow = await methods.getMemberByIdm(idm);
            event.reply(replyChannel, row);
            return;            
        }
        /** 入室にする(退室にする) */
        else if(command == methods.setInRoomByFcno.name){
            const fcno:string = args[0];
            const idm:string = args[1];
            const in_room:boolean = args[2];
            const count = await methods.setInRoomByFcno(fcno, idm, in_room);
            event.reply(replyChannel, count);
            return;
        }
        logger.error(`comman is not match =(${command})`)
    });
}