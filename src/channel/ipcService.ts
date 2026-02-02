export const IpcChannels = {
    CHANNEL_REQUEST_QUERY: 'request-query-asynchronous',
    CHANNEL_REPLY_QUERY: 'reply-query-asynchronous',
    CHANNEL_IPC_EXAMPLE: 'ipc-example',
} as const;

export type IpcChannelKeyOfService = keyof typeof IpcChannels;

export type IpcChannelValOfService = (typeof IpcChannels)[keyof typeof IpcChannels];
