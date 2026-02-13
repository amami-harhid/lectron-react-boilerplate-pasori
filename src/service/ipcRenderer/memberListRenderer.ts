import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { MemberRow } from '@/db/members/memberRow';
import { memberListPageServiceMethods } from '../ipcMain/memberListServiceMethods';
const methods = memberListPageServiceMethods;
const ipcRenderer = window.electronService.ipcServiceRenderer;

export const memberListService = {
    /** FCNOを指定してメンバーを取り出す */
    getMemberByFcno: async function(fcno:string): Promise<MemberRow> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<MemberRow>(CHANNEL_REPLY);
        return val;
    },
    getMembers: async function(): Promise<MemberRow[]> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMembers.name);
        const rows = await ipcRenderer.asyncOnce<MemberRow[]>(CHANNEL_REPLY);
        return rows;
    },
    /** メンバーを追加する */
    addMember: async function(row: MemberRow): Promise<boolean> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.addMember.name, row);    
        const val = await ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを更新する */
    updateMemberByFcno: async function(fcno: string, row: MemberRow): Promise<boolean> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.updateMemberByFcno.name, fcno, row);    
        const val = await ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを論理削除する */
    deleteMemberByFcno: async function(fcno: string): Promise<boolean> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.deleteMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
        return val;
    },
};
