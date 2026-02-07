import Electron, { ipcMain, type IpcMainEvent } from 'electron';

export const  ipc_is_production = ( is_production:boolean ) => {
  const Channel = "IS_PRODUCTION";
  ipcMain.on(Channel, async(event:Electron.IpcMainEvent)=>{
      event.reply(Channel, is_production);
  });
}
