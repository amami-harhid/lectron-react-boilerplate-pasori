import { ipcMainTopPage } from '../ipcMain/topPageService';
import { ipcMainMemberListPage } from "./memberListService";
import { ipcMainMemberTrashedListPage } from './memberTrashedListService';
import { ipcMainIdmRegistPage } from './idmRegistPageService';
import { ipcMainHistoriesListPagePage } from './historiesPageService';
// RENDERER --> MAIN -->RENDERERのDB通信
export function ipcMainSqliteBridge() {
    ipcMainTopPage();
    ipcMainMemberListPage();
    ipcMainHistoriesListPagePage();
    ipcMainIdmRegistPage();
    ipcMainMemberTrashedListPage();
};

