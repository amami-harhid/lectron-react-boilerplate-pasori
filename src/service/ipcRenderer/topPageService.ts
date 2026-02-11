import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { Cards } from '@/db/cards/cards';
import { Histories } from '@/db/histories/histories';
import { CardRow } from '@/db/cards/cardRow';

export const topPageService = {
    /** IDMが紐づいたメンバーを取得する */
    getMemberByIdm: async function(idm:string): Promise<CardRow> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.selectRowByIdm.name, idm);    
        const val = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを取り出す */
    setInRoomByFcno: async function(fcno:string, idm:string, in_room:boolean): Promise<number> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.updateInRoomByFcno.name, fcno, in_room);
        const cCount = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Histories.setInRoomByFcnoIdm.name, fcno, idm);
        const hCount = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);        
        return cCount+hCount;
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
