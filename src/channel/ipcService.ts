export const IpcChannels = {
    CHANNEL_REQUEST_QUERY: 'request-query-asynchronous',
    CHANNEL_REPLY_QUERY: 'reply-query-asynchronous',
    CHANNEL_IPC_EXAMPLE: 'ipc-example',
} as const;

export const IpcServiceChannels = {
    CHANNEL_REQUEST: 'request-service',
    CHANNEL_REPLY: 'reply-service',
} as const;

export const IpcMailServiceChannels = {
    CHANNEL_MAIL_REQUEST: 'request-mail-service',
    CHANNEL_MAIL_REPLY: 'reply-mail-service',
} as const;

export type IpcChannelKeyOfService = keyof typeof IpcChannels;

export type IpcChannelValOfService = (typeof IpcChannels)[keyof typeof IpcChannels];

export type IpcServiceChannelKeyOfService = keyof typeof IpcServiceChannels;

export type IpcServiceChannelValOfService = (typeof IpcServiceChannels)[keyof typeof IpcServiceChannels];

export type IpcMailServiceChannelsKeyOfService = keyof typeof IpcMailServiceChannels;

export type IpcMailServiceChannelsValOfService = (typeof IpcMailServiceChannels)[keyof typeof IpcMailServiceChannels];
