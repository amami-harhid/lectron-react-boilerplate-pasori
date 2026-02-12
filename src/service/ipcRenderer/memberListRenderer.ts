import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { Cards } from '@/db/cards/cards';
import { CardRow } from '@/db/cards/cardRow';
import { memberListPageServiceMethods } from '../ipcMain/memberListServiceMethods';
const methods = memberListPageServiceMethods;
const ipcRenderer = window.electronService.ipcServiceRenderer;

export const memberListService = {
    /** FCNOを指定してメンバーを取り出す */
    getMemberByFcno: async function(fcno:string): Promise<CardRow> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return val;
    },
    getMembers: async function(): Promise<CardRow[]> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMembers.name);
        const rows = await ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return rows;
    },
    /** メンバーを追加する */
    addMember: async function(row: CardRow): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.addMember.name, row);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを更新する */
    updateMemberByFcno: async function(fcno: string, row: CardRow): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.updateMemberByFcno.name, fcno, row);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを論理削除する */
    deleteMemberByFcno: async function(fcno: string): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.deleteMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
};
