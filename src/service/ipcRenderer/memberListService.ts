import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { Cards } from '@/db/cards/cards';
import { CardRow } from '@/db/cards/cardRow';

export const memberListService = {
    /** 全メンバーを取得する（論理削除分を除く） */
    getMembers: async function(): Promise<CardRow[]> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.selectAll.name);    
        const val = await window.electron.ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを取り出す */
    getMemberByFcno: async function(fcno:string): Promise<CardRow> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.selectRowByFcno.name, fcno);    
        const val = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return val;
    },
    /** メンバーを追加する */
    addMember: async function(row: CardRow): Promise<number> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.insert.name, row);    
        const val = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを更新する */
    updateMemberByFcno: async function(fcno: string, row: CardRow): Promise<number> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.updatePersonalDataByFcno.name, fcno, row);    
        const val = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを論理削除する */
    deleteMemberByFcno: async function(fcno: string): Promise<number> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.deleteByFcno.name, fcno);    
        const val = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
};
