import * as IpcServices from '@/channel/ipcService';
type CHANNEL = IpcServices.IpcServiceChannelValOfService;
/** リクエストチャンネル */
export const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcServiceChannels.CHANNEL_REQUEST
/** レスポンスチャンネル */
export const CHANNEL_REPLY:CHANNEL = IpcServices.IpcServiceChannels.CHANNEL_REPLY;

