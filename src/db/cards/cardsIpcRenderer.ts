import { ipcRenderer } from "electron";
import * as Cards from "./cards";
import { CardRow } from "./cardRow";

export function ipcRendererBridge() {
    ipcRenderer.on(Cards.deleteByFcno.name, async(event:Electron.IpcRendererEvent, change:number)=>{
        console.log(`change=${change}`);
    });
    ipcRenderer.on(Cards.selectRowByFcno.name, async(event:Electron.IpcRendererEvent, row:CardRow)=>{
        console.log(row);
    });
};

// TODO 
type ChannelRender = "selectRowByFcno"
const aaa = {
    ipcRenderer:{
        on: (Cards.selectRowByFcno.name, func : async(event:Electron.IpcRendererEvent, row:CardRow)=>void),

    }
}