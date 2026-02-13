import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import type { MemberRow } from '@/db/members/memberRow';
import type { MemberIdmRow } from '@/db/members/memberIdmRow';
import { idmRegisterServiceMethods } from '../ipcMain/idmRegistPageServiceMethods';
const methods = idmRegisterServiceMethods;

const ipcRenderer = window.electronService.ipcServiceRenderer;

export const idmRegisterService = {
    /** 論理削除中のメンバーを取り出す */
    registIdmToMemberByFcno: async function(fcno:string, idm:string): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.registIdmToMemberByFcno.name, fcno, idm);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },
    /** FCNOを指定してIDMの登録を解除する */
    releaseIdmToMemberByFcno: async function(fcno:string): Promise<number> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.releaseIdmToMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return val;
    },

    /** FCNOを指定してメンバーを取得する */
    getMemberByFcno: async function(fcno:string): Promise<MemberIdmRow> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMemberByFcno.name, fcno);    
        const val = await ipcRenderer.asyncOnce<MemberIdmRow>(CHANNEL_REPLY);
        return val;
    },

    /** Idmが紐づいているメンバーを取得する */
    getMemberByIdm: async function(idm:string): Promise<MemberIdmRow> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMemberByIdm.name, idm);    
        const val = await ipcRenderer.asyncOnce<MemberIdmRow>(CHANNEL_REPLY);
        return val;
    },
    /** Idmが紐づいていないメンバーを取得する */
    getMemberIdmIsEmpty: async function(): Promise<MemberIdmRow[]> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getMemberIdmIsEmpty.name);    
        const val = await ipcRenderer.asyncOnce<MemberIdmRow[]>(CHANNEL_REPLY);
        return val;
    },
};
