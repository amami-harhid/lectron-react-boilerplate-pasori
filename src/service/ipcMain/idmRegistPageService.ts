import electron from 'electron';
const ipcMain = electron.ipcMain;
import { LoggerRef } from '@/log/loggerReference';
const logger = LoggerRef.logger;

import * as IpcServices from '@/channel/ipcService';

import { idmRegisterServiceMethods } from './idmRegistPageServiceMethods';
const methods = idmRegisterServiceMethods;

const CHANNEL_REQUEST = IpcServices.IpcServiceChannels.IDMREGIST_CHANNEL_REQUEST;
const CHANNEL_REPLY = IpcServices.IpcServiceChannels.IDMREGIST_CHANNEL_REPLY;

export function ipcMainIdmRegistPage() {

    ipcMain.on(CHANNEL_REQUEST, async(event:Electron.IpcMainEvent, command:string, ...args:any[])=>{
        // FCNO指定でIDMを紐づける
        if( command == methods.registIdmToMemberByFcno.name ){
            const fcno:string = args[0];
            const idm:string = args[1];
            const rslt = await methods.registIdmToMemberByFcno(fcno, idm);
            event.reply(CHANNEL_REPLY, rslt);
            return;            
        }
        // FCNO指定でIDM紐づけを解除する
        else if(command == methods.releaseIdmToMemberByFcno.name){
            const fcno:string = args[0];
            const rows = await methods.releaseIdmToMemberByFcno(fcno);
            event.reply(CHANNEL_REPLY, rows);
            return;
        }
        // FCNOを指定してメンバーを取得する
        else if(command == methods.getMemberByFcno.name){
            console.log('command=',command);
            const fcno:string = args[0];
            console.log('fcno=',fcno);
            const rslt = await methods.getMemberByFcno(fcno);
            console.log('rslt=',rslt);
            event.reply(CHANNEL_REPLY, rslt);
            return;
        }
        // Idmが紐づいているメンバーを取得する
        else if(command == methods.getMemberByIdm.name){
            const idm:string = args[0];
            const rslt = await methods.getMemberByIdm(idm);
            event.reply(CHANNEL_REPLY, rslt);
            return;
        }
        // Idmが紐づいていないメンバーを取得する
        else if(command == methods.getMemberIdmIsEmpty.name){
            const fcno:string = args[0];
            const rslt = await methods.getMemberIdmIsEmpty(fcno);
            event.reply(CHANNEL_REPLY, rslt);
            return;
        }
        logger.error(`comman is not match =(${command})`)
    });
}
