// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { CardReaderID } from "../card/cardEventID";
import { CardRow } from '../db/cards/cardRow';

export type Channels = 'ipc-example' | 'asynchronous-sql-reply' | 'asynchronous-sql-command';
const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
        ipcRenderer.once(channel, (_event, ...args) => {
            const reply = func(...args);
        });
    },
    asyncOnce<T>(channel: Channels):Promise<T> {
      return new Promise<T>( (resolve)=>{
        ipcRenderer.once(channel, (_event, arg:T) => {
            //const reply = func(arg);
            resolve(arg);
        })
      });

    },
  },
};
const electronNavigate = {
  onNavigate: (callback:CallableFunction) => {
    ipcRenderer.on("navigate", (_, path) => {
      callback(path)
    })
  },
};
const electronPasoriCard = {
  onTouch: (callback:CallableFunction) => {
    ipcRenderer.on( CardReaderID.CARD_TOUCH, async(_, idm) => {
      await callback(idm);
    })
  },
  onRelease: (callback:CallableFunction) => {
    ipcRenderer.on( CardReaderID.CARD_RELEASE, async(_, idm) => {
      await callback(idm);
    })
  },
  onCardReady: (callback:CallableFunction) => {
    ipcRenderer.on( CardReaderID.CARD_READY, async(_, device_name) => {
      await callback(device_name);
    })
  },
  onCardStart: async () => {
    await ipcRenderer.invoke( CardReaderID.CARD_START);
  },
  onCardStop: async () => {
    await ipcRenderer.invoke( CardReaderID.CARD_STOP);
  },
  
};
contextBridge.exposeInMainWorld('electron', electronHandler);
contextBridge.exposeInMainWorld('navigate', electronNavigate);
contextBridge.exposeInMainWorld('pasoriCard', electronPasoriCard);

export type DbChannels = 'cards' | 'histories';
const electronPasoriDb = {
    cardRequest(channel: DbChannels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    cardAllOnce(channel: DbChannels, func: (rows: CardRow[]) => void) {
      ipcRenderer.once(channel, (_event:IpcRendererEvent, rows:CardRow[]) => func(rows));
    },
    cardGetOnce(channel: DbChannels, func: (row:CardRow) => void) {
      ipcRenderer.once(channel, (_event:IpcRendererEvent, row) => func(row));
    },
}
contextBridge.exposeInMainWorld('pasoriDb', electronPasoriDb);



export type ElectronHandler = typeof electronHandler;
export type ElectronNavigate = typeof electronNavigate;
export type ElectronPasoriCard = typeof electronPasoriCard;
export type ElectronPasoriDb = typeof electronPasoriDb;