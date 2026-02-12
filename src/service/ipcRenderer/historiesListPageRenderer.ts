import { CHANNEL_REPLY, CHANNEL_REQUEST } from '../ipcChannel';
import { Histories } from '@/db/histories/histories';
import { HistoriesRow } from '@/db/histories/historiesRow';
import { historiesPageServiceMethods } from '../ipcMain/historiesPageServiceMethods';
const methods = historiesPageServiceMethods;
const ipcRenderer = window.electronService.ipcServiceRenderer;

export const historiesPageService = {
    /** 日付を指定して全履歴を取得する */
    getHistoriesByDate: async function(date:Date): Promise<HistoriesRow[]> {
        ipcRenderer.send(CHANNEL_REQUEST, methods.getHistoriesByDate.name, date);    
        const val = await ipcRenderer.asyncOnce<HistoriesRow[]>(CHANNEL_REPLY);
        return val;
    },
};
