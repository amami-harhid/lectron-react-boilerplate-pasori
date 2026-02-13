import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { HistoriesMemberIdmRow } from '@/db/histories/historiesRow';

import { topPageServiceMethods } from '../ipcMain/topPageServiceMethods';
const methods = topPageServiceMethods;
const ipcRenderer = window.electronService.ipcServiceRenderer;

export const topPageService = {
    /** IDMが紐づいたメンバーを取得する */
    getMemberByIdm: async function(idm:string): Promise<HistoriesMemberIdmRow> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMemberByIdm.name, idm);    
        const val = await ipcRenderer.asyncOnce<HistoriesMemberIdmRow>(CHANNEL_REPLY);
        return val;
    },
    /** 入室にする(退室にする) */
    setInRoomByFcno: async function(fcno:string, idm:string, in_room:boolean): Promise<boolean> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.setInRoomByFcno.name, fcno, idm, in_room);
        const count = await ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
        return count;
    },
};
