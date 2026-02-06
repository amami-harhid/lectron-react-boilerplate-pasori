import * as IpcServices from '../channel/ipcService';

type CHANNEL = IpcServices.IpcChannelValOfService;
const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;

const service = async <T>(command:string, ...args:any[]):Promise<T> => {
    window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, command, ...args);
    const val:T = await window.electron.ipcRenderer.asyncOnce<T>(CHANNEL_REPLY);
    return val;
}

export const RenderService = {
    exe: service,
}
