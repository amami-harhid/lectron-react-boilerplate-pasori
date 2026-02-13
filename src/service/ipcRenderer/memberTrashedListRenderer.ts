import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { MemberRow } from '@/db/members/memberRow';
import { memberTrashedListServiceMethods } from '../ipcMain/memberTrashedListServiceMethods';
const methods = memberTrashedListServiceMethods;
const ipcRenderer = window.electronService.ipcServiceRenderer;

export const memberTrashedListService = {
    /** 論理削除されたメンバーを取り出す */
    getTrashedMembers: async function(): Promise<MemberRow[]> {

        ipcRenderer.send(CHANNEL_REQUEST, methods.getTrashedMembers.name);    
        const val = await ipcRenderer.asyncOnce<MemberRow[]>(CHANNEL_REPLY);
        return val;
    },
    /** 論理削除されたメンバーを復元させる */
    setRecorverMemberByFcno: async function(fcno:string): Promise<boolean> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.setRecorverMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
        return val;
    },
    /** 論理削除されたメンバーを完全削除する（紐づく履歴も完全削除） */
    deleteCompletelyByFcno: async function(fcno:string): Promise<boolean> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.deleteCompletelyByFcno.name, fcno);    
        const c_val = await ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
        return c_val;
    },
};
