import * as IpcServices from '@/channel/ipcService';

type CHANNEL = IpcServices.IpcChannelValOfService;
/** リクエストチャンネル */
export const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
/** レスポンスチャンネル */
export const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;

