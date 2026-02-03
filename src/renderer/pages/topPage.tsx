import { useRef, useEffect, useState } from "react";
import * as IpcServices from '../../channel/ipcService';
import * as Cards from '../../db/cards/cards';
import * as Histories from '../../db/histories/histories';
import { CardRow } from '../../db/cards/cardRow';

type CHANNEL = IpcServices.IpcChannelValOfService;
const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;

type View = {
  pageTitle: string,
  name: string,
  status: string,
  modal_display: string,
  is_ready: boolean,
}

const Display = {
  block: 'block',
  inline_block: 'inline-block',
  none: 'none',
} as const;

const initView: View = {
  pageTitle: '入退室チェッカー',
  name: '',
  status : '',
  modal_display : Display.none,
  is_ready: false,
} as const;


export function TopPage() {
    const [view, setView] = useState(initView);

    const setPageView = ( _view: View ) => {
        const _clone = structuredClone(_view);
        console.log(_clone);
        setView(_clone);
    }
    const cardsSelectCardRow = async (idm:string): Promise<CardRow | undefined> => {
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.cards_selectRowByIdm.name, idm);
        // 応答を待つ
        const row: CardRow
            = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
        return row;
    };
    const setInRoom = async(fcno:string, idm: string) : Promise<number> => {
        const in_room = true;
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.cards_updateInRoomByFcno.name, fcno, in_room);
        // 応答を待つ
        const card_count: number
            = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        // 履歴を更新
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Histories.hist_setInRoomByFcnoIdm.name, fcno, idm );
        // 応答を待つ
        const hist_count: number
            = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return hist_count;
    }
    const setOutRoom = async(fcno:string, idm: string) : Promise<number> => {
        const in_room = false;
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.cards_updateInRoomByFcno.name, fcno, in_room);
        // 応答を待つ
        const card_count: number
            = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        // 履歴を更新
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Histories.hist_setOutRoomByFcnoIdm.name, fcno, idm );
        // 応答を待つ
        const hist_count: number
            = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        return hist_count;
    }

    const cardRelease = () => {
        console.log('カードリリース')
        view.status = '';
        view.modal_display = Display.none;
        setPageView(view);
    }
    const cardTouch = async (idm :string) => {
        console.log('カードタッチ')
        console.log('TOP PAGE idm=', idm);
        if(idm.length==0){
            // 安全のために空チェック
            return;
        }
        // idmが登録されている利用者を取得する
        const row = await cardsSelectCardRow(idm);
        if(row) {
            const fcno = row.fcno;
            if( row.in_room == true ) {
                // 入室中
                await setOutRoom( fcno, idm);
                view.status = '退室しました';
                view.name = `(${row.name}さん)`
            }else{
                // 退室中
                await setInRoom( fcno, idm);
                view.status = '入室しました';
                view.name = `(${row.name}さん)`
            }
            view.modal_display = Display.block;
        }else{
            view.modal_display = Display.block;
            view.status = `未登録カード(${idm})`;
            view.name = ``
        }
        setPageView(view);

    }
    const cardTouchListenerStart = () => {
        // カードが離れたときの処理
        window.pasoriCard.onRelease( async(ipc_idm:string)=>{
            cardRelease();
        });

        // カードタッチしたときの処理
        window?.pasoriCard.onTouch(async (idm:string)=>{
            await cardTouch(idm);
        });
    }

    const isReaderReady = async () => {
        view.is_ready  = true;
        const isReady = await window.pasoriCard.isCardReady();
        if(isReady){
          cardTouchListenerStart();
        }else{
          view.modal_display = Display.block;
          view.status = `リーダーが動作していません`;
          setPageView(view);
        }
    }
    if(view.is_ready === false) // 2回目の動作を抑止
        isReaderReady();

    return (
        <>
        <h1 className="pageTitle"><span>{view.pageTitle}</span></h1>
        <div className="modal" style={{display: view.modal_display}}>
            <div className="modal-content">
                <div className="card">
                  <p>{view.status}</p>
                  <p>{view.name}</p>
                </div>
            </div>
        </div>
        </>
    );
}
