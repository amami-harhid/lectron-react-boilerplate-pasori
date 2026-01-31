import { ipcMain } from "electron";
import * as Cards from "./cards";
import { db } from "../db";
export function ipcMainBridge() {
    ipcMain.on(Cards.deleteByFcno.name, async(event:Electron.IpcMainEvent, fcno:string)=>{
        const result = await Cards.deleteByFcno(db, fcno)
        event.reply(Cards.deleteByFcno.name, result);
    });

    ipcMain.on(Cards.deletePhisycalByFcno.name, async(event:Electron.IpcMainEvent, fcno:string)=>{
        const result = await Cards.deletePhisycalByFcno(db, fcno)
        event.reply(Cards.deletePhisycalByFcno.name, result);
    });

    ipcMain.on(Cards.selectRowByFcno.name, async(event:Electron.IpcMainEvent, fcno:string)=>{
        const rows = await Cards.selectRowByFcno(db, fcno)
        event.reply(Cards.selectRowByFcno.name, rows);
    });
}
