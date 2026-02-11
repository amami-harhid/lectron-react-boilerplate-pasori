import { CHANNEL_REPLY, CHANNEL_REQUEST } from './ipcChannel';

/** サービスを呼び出しレスポンスを返す */
const service = async <T>(command:string, ...args:any[]):Promise<T> => {
    window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, command, ...args);
    const val:T = await window.electron.ipcRenderer.asyncOnce<T>(CHANNEL_REPLY);
    return val;
}

/** サービス */
export const RenderService = {
    exe: service,
}
