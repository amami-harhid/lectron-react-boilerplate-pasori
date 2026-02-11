import { CHANNEL_REPLY, CHANNEL_REQUEST } from './ipcChannel';
import { Histories } from '@/db/histories/histories';
import { HistoriesRow } from '@/db/histories/historiesRow';

export const historiesPageService = {
    /** 日付を指定して全履歴を取得する */
    getHistoriesByDate: async function(date:Date): Promise<HistoriesRow[]> {
        window.electron.ipcRenderer.sendMessage(CHANNEL_REQUEST, Histories.selectByDate.name, date);    
        const val = await window.electron.ipcRenderer.asyncOnce<HistoriesRow[]>(CHANNEL_REPLY);
        return val;
    },
};
