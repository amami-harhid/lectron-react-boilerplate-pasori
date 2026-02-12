import electron from 'electron';
const ipcMain = electron.ipcMain;
import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { CardRow } from '@/db/cards/cardRow';
import * as IpcServices from '@/channel/ipcService';

import { memberListPageServiceMethods } from './memberListServiceMethods';
const methods = memberListPageServiceMethods;
export function ipcMainMemberListPage() {
    const channel = IpcServices.IpcServiceChannels.CHANNEL_REQUEST;
    const replyChannel = IpcServices.IpcServiceChannels.CHANNEL_REPLY;
    ipcMain.on(channel, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        console.log('ipcMain.on memberListPage')
        // IDMが紐づいたメンバーを取得する
        if( command == methods.getMemberByFcno.name ){
            const fcno:string = args[0];
            const row: CardRow = await methods.getMemberByFcno(fcno);
            event.reply(replyChannel, row);
            return;            
        }
        /** 全メンバーを取得する */
        else if(command == methods.getMembers.name){
            console.log('ipcMain.on command=',command);

            const rows = await methods.getMembers();
            console.log('rows=',rows);
            event.reply(replyChannel, rows);
            return;
        }
        /** メンバーを追加する */
        else if(command == methods.addMember.name){
            const row:CardRow = args[0];
            const rslt = await methods.addMember(row);
            event.reply(replyChannel, rslt);
            return;
        }
        /** メンバー情報を変更する */
        else if(command == methods.updateMemberByFcno.name){
            const fcno:string = args[0];
            const row:CardRow = args[1];
            const rslt = await methods.updateMemberByFcno(fcno, row);
            event.reply(replyChannel, rslt);
            return;
        }
        /** メンバー情報を論理削除する */
        else if(command == methods.deleteMemberByFcno.name){
            const fcno:string = args[0];
            const rslt = await methods.deleteMemberByFcno(fcno);
            event.reply(replyChannel, rslt);
            return;
        }
        logger.error(`comman is not match =(${command})`)
    });
}
