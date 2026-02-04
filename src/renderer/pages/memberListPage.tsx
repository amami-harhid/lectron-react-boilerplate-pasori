'use client'
import { useRef, useEffect, useState } from "react";
import * as IpcServices from '../../channel/ipcService';
import * as Cards from '../../db/cards/cards';
import { CardRow } from '../../db/cards/cardRow';

type TABLE_ROW = {
    id:number,
    fcno:string,
    name:string,
    kana:string,
    mail:string,
}

type PAGEINFO = {
    view: {guidance:string},
    tableData: TABLE_ROW[],
}

type CHANNEL = IpcServices.IpcChannelValOfService;
const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;


export function MemberListPage () {
    const [pageInfo, setPageInfo] = useState<PAGEINFO>({view:{guidance:""},tableData:[]});
    const cardsSelectAll = async (): Promise<CardRow[]> => {
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.selectAll.name);
        // 応答を待つ
        const rows: CardRow[]
            = await window.electron.ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return rows;
    };

    const membersToTableData = async ():Promise<void> => {
        const rows:CardRow[] = await cardsSelectAll();
        const _data:TABLE_ROW[] = [];
        for(const row of rows){
            const newId = _data.length > 0 ? _data[_data.length - 1].id + 1 : 1;
            const newRow:TABLE_ROW = {
                id: newId,
                fcno: row.fcno,
                name: (row.name)?row.name:'',
                kana: (row.kana)?row.kana:'',
                mail: (row.mail)?row.mail:'',
            }
            _data.push(newRow);
        }
        setPageInfo({view:{guidance:""}, tableData: _data});
    }

    const reload = () => {
        membersToTableData();
    }

    useEffect(() => {
        membersToTableData();
    },[]);
    
    // カードが離れたときの処理
    window.pasoriCard.onRelease(async()=>{});
    // カードタッチしたときの処理
    window.pasoriCard.onTouch(async ()=>{});

    return (
        <>
        <div className="modal_manager" >
            <div className="modal-content">
                <h2><span>利用者一覧</span></h2>
                <div><button onClick={reload}>リロード</button></div>
                <h4>{pageInfo.view.guidance}</h4>
                <table className="appTable">
                    <tbody>
                    <tr>
                        <th>NO</th>
                        <th>FCNO</th>
                        <th>名前</th>
                        <th>カナ</th>
                        <th>MAIL</th>
                    </tr>
                    </tbody>
                    <tbody>
                      {pageInfo.tableData.map(row=>(
                       <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.fcno}</td>
                            <td>{row.name}</td>
                            <td>{row.kana}</td>
                            <td>{row.mail}</td>
                       </tr>
                    ))}
                    </tbody>
                </table>

            </div>
        </div>
        </>
    );
}
