import { ipcRenderer } from "electron";
import * as Cards from "./cards";
import { CardRow } from "./cardRow";

const NameSelectRowByFcno = Cards.selectRowByFcno.name;

type CSelectRowByFcno = "selectRowByFcno"

const DbCardsHandler = {
    ipcRenderer:{
        sendSelectRowByFcno(channel:CSelectRowByFcno, fcno:String){
            ipcRenderer.send(channel, fcno);
        },
        onSelectRowByFcno(channel:CSelectRowByFcno, func:(row:CardRow)=>void){
            ipcRenderer.once(channel, (_event, row) => func(row));
        },
      }
}
