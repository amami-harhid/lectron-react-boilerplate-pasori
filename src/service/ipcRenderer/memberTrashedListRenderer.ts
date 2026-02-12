import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { Cards } from '@/db/cards/cards';
import { Histories } from '@/db/histories/histories';
import { CardRow } from '@/db/cards/cardRow';

const ipcRenderer = window.electronService.ipcServiceRenderer;

export const memberTrashedListService = {
    /** 論理削除されたメンバーを取り出す */
    getTrashedMembers: async function(): Promise<CardRow[]> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.selectAllSoftDeleted.name);    
        const val = await ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return val;
    },
    /** 論理削除されたメンバーを復元させる */
    setRecorverMemberByFcno: async function(fcno:string): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.recoveryByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** 論理削除されたメンバーを完全削除する（紐づく履歴も完全削除） */
    deleteCompletelyByFcno: async function(fcno:string): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.deletePhisycalByFcno.name, fcno);    
        const c_val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        ipcRenderer.send(CHANNEL_REQUEST, Histories.deleteHistoriesByFcno.name, fcno);    
        const h_val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return c_val+h_val;
    },
    /** IDMが紐づいたメンバーを取得する */
    getMemberByIdm: async function(idm:string): Promise<CardRow> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.selectRowByIdm.name, idm);    
        const val = await ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを取り出す */
    setInRoomByFcno: async function(fcno:string, idm:string, in_room:boolean): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.updateInRoomByFcno.name, fcno, in_room);
        const cCount = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
       ipcRenderer.send(CHANNEL_REQUEST, Histories.setInRoomByFcnoIdm.name, fcno, idm);
        const hCount = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);        
        return cCount+hCount;
    },
    /** メンバーを追加する */
    addMember: async function(row: CardRow): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.insert.name, row);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを更新する */
    updateMemberByFcno: async function(fcno: string, row: CardRow): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.updatePersonalDataByFcno.name, fcno, row);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してメンバーを論理削除する */
    deleteMemberByFcno: async function(fcno: string): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, Cards.deleteByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
};
