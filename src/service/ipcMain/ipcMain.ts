import { ipcMain } from 'electron';
import * as IpcServices from '@/channel/ipcService';
import { ipcMainTopPage } from '../ipcMain/topPageService';
import { ipcMainMemberListPage } from "./memberListService";
import { ipcMainMemberTrashedListPage } from './memberTrashedListService';
import { ipcMainIdmRegistPage } from './idmRegistPageService';
import { ipcMainHistoriesListPagePage } from './historiesPageService';
import { ipcMail } from './mailService';

const channel = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const replyChannel = IpcServices.IpcServiceChannels.CHANNEL_REPLY;

// RENDERER --> MAIN -->RENDERERのDB通信
export function ipcMainSqliteBridge() {
    ipcMainTopPage();
    ipcMainMemberListPage();
    ipcMainHistoriesListPagePage();
    ipcMainIdmRegistPage();
    ipcMainMemberTrashedListPage();
    ipcMail();
};


