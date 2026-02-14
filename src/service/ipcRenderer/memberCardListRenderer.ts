import * as IpcServices from '@/channel/ipcService';
import { MemberRow } from '@/db/members/memberRow';
import { MemberIdmRow } from '@/db/members/memberIdmRow';
import { memberCardListPageServiceMethods } from '../ipcMain/memberCardListServiceMethods';
const methods = memberCardListPageServiceMethods;
const ipcRenderer = window.electronService.ipcServiceRenderer;

const CHANNEL_REQUEST = IpcServices.IpcServiceChannels.MEMBERCARDLIST_CHANNEL_REQUEST;
const CHANNEL_REPLY = IpcServices.IpcServiceChannels.MEMBERCARDLIST_CHANNEL_REPLY;

export const memberCardListService = {
    /** FCNO指定でIDMを更新する */
    setIdmByFcno: async function(fcno:string, idm:string): Promise<MemberIdmRow> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.setIdmByFcno.name, fcno, idm);    
        const val = await ipcRenderer.asyncOnce<MemberIdmRow>(CHANNEL_REPLY);
        return val;
    },
    /** 全メンバーを取得する */
    getMembers: async function(): Promise<MemberIdmRow[]> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMembers.name);    
        const val = await ipcRenderer.asyncOnce<MemberIdmRow[]>(CHANNEL_REPLY);
        return val;
    },
};
