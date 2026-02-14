import electron from 'electron';
const ipcMain = electron.ipcMain;
import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import type { MemberRow } from '@/db/members/memberRow';
import type { MemberIdmRow } from '@/db/members/memberIdmRow';
import * as IpcServices from '@/channel/ipcService';

import { memberCardListPageServiceMethods } from './memberCardListServiceMethods';
const methods = memberCardListPageServiceMethods;

const channel = IpcServices.IpcServiceChannels.MEMBERCARDLIST_CHANNEL_REQUEST;
const replyChannel = IpcServices.IpcServiceChannels.MEMBERCARDLIST_CHANNEL_REPLY;

export function ipcMainMemberCardListPage() {
    ipcMain.on(channel, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        // IDMが紐づいたメンバーを取得する
        if( command == methods.setIdmByFcno.name ){
            const fcno:string = args[0];
            const idm:string = args[1];
            console.log('membersList command=',command)
            const result: boolean = await methods.setIdmByFcno(fcno, idm);
            event.reply(replyChannel, result);
            return;            
        }
        // IDMが紐づいたメンバーを取得する
        else if( command == methods.getMembers.name ){
            const row: MemberIdmRow[] = await methods.getMembers();
            event.reply(replyChannel, row);
            return row;            
        }
        logger.error(`comman is not match =(${command})`)
    });
}
