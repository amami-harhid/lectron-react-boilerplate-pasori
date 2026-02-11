import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { Cards } from '@/db/cards/cards';
import { CardRow } from '@/db/cards/cardRow';

export const idmRegisterService = {
    /** 論理削除中のメンバーを取り出す */
    registIdmToMemberByFcno: async function(fcno:string, idm:string): Promise<number> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.linkIdmByFcno.name, fcno, idm);    
        const val = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してIDMの登録を解除する */
    releaseIdmToMemberByFcno: async function(fcno:string): Promise<number> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.releaseIdmByFcno.name, fcno);    
        const val = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },

    /** FCNOを指定してメンバーを取得する */
    getMemberByFcno: async function(fcno:string): Promise<CardRow> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.selectRowByFcno.name, fcno);    
        const val = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return val;
    },

    /** Idmが紐づいているメンバーを取得する */
    getMemberByIdm: async function(idm:string): Promise<CardRow> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.selectRowByIdm.name, idm);    
        const val = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return val;
    },
    /** Idmが紐づいていないメンバーを取得する */
    getMemberIdmIsEmpty: async function(): Promise<CardRow[]> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Cards.selectRowsEmptyIdm.name);    
        const val = await window.electron.ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return val;
    },
};
