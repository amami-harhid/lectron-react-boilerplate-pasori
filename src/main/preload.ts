// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { CardRow } from '../db/cards/cardRow';
import * as IpcServices from '../channel/ipcService';
import {CardReaderID, type TCardReaderChannel} from '../card/cardEventID';
export type Channels = IpcServices.IpcChannelValOfService;
const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, methodName:string, ...args: unknown[]) {
      ipcRenderer.send(channel, methodName, ...args);
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
            // 中途半端　、たぶん使わない。
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
    const f = async(event:Electron.IpcRendererEvent, idm:string) => {
      await callback(idm);
    }
    ipcRenderer.removeAllListeners(CardReaderID.CARD_TOUCH);
    ipcRenderer.on( CardReaderID.CARD_TOUCH, f);
  },
  onRelease: (callback:CallableFunction) => {
    ipcRenderer.removeAllListeners(CardReaderID.CARD_RELEASE);
    ipcRenderer.on( CardReaderID.CARD_RELEASE, async(_, idm) => {
      await callback(idm);
    })
  },
  onCardReady: (callback:CallableFunction) => {
    ipcRenderer.on( CardReaderID.CARD_READY, async(_, device_name) => {
      await callback(device_name);
    })
  },
  isCardReady: async () => {
      ipcRenderer.send( CardReaderID.ListenCardIsReady);
      return new Promise<boolean>( (resolve)=>{
        ipcRenderer.once(CardReaderID.ListenCardIsReady, (_event, ready:boolean) => {
            resolve(ready);
        })
      });
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

/*
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
*/


export type ElectronHandler = typeof electronHandler;
export type ElectronNavigate = typeof electronNavigate;
export type ElectronPasoriCard = typeof electronPasoriCard;
//export type ElectronPasoriDb = typeof electronPasoriDb;
