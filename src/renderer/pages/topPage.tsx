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
  card_display: string,
  error_display: string,
  errorMessage01: string,
  errorMessage02: string,
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
  card_display: Display.block,
  error_display: Display.none,
  errorMessage01: '',
  errorMessage02: '',
} as const;


export function TopPage() {
    const [view, setView] = useState(initView);

    const setPageView = ( _view: View ) => {
        const _clone = structuredClone(_view);
        setView(_clone);
    }
    const cardsSelectCardRow = async (idm:string): Promise<CardRow | undefined> => {
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.selectRowByIdm.name, idm);
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
            Cards.updateInRoomByFcno.name, fcno, in_room);
        // 応答を待つ
        const card_count: number
            = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        // 履歴を更新
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Histories.setInRoomByFcnoIdm.name, fcno, idm );
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
            Cards.updateInRoomByFcno.name, fcno, in_room);
        // 応答を待つ
        const card_count: number
            = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);
        // 履歴を更新
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Histories.setOutRoomByFcnoIdm.name, fcno, idm );
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
        }else{
            view.status = `未登録カード(${idm})`;
            view.name = ``
        }
        view.modal_display = Display.block;
        setPageView(view);

    }
    const cardTouchListenerStart = () => {
        // カードが離れたときの処理
        window.pasoriCard.onRelease( async(ipc_idm:string)=>{
            cardRelease();
        });

        // カードタッチしたときの処理
        window.pasoriCard.onTouch(async (idm:string)=>{
            await cardTouch(idm);
        });
    }

    const isReaderReady = async () => {
        view.is_ready  = true;
        const isReady = await window.pasoriCard.isCardReady();
        if(isReady){
          view.card_display = Display.block;
          view.error_display = Display.none;
          view.errorMessage01 = ``;
          view.errorMessage02 = ``;
          cardTouchListenerStart();
        }else{
          view.modal_display = Display.block;
          view.card_display = Display.none;
          view.error_display = Display.block;
          view.errorMessage01 = `カードリーダーの接続を確認できません`;
          view.errorMessage02 = `接続し再起動してください`;
          setPageView(view);
        }
    }

    useEffect(()=>{
        view.modal_display = Display.none,
        view.is_ready = false;
        isReaderReady();
    },[]);

    return (
        <>
        <div className="modal" style={{display: view.modal_display}}>
            <div className="modal-content">
                <div className="card" style={{display: view.card_display}}>
                  <p>{view.status}</p>
                  <p>{view.name}</p>
                </div>
                <div className="card" style={{display: view.error_display}}>
                    <p className="errorMessage">{view.errorMessage01}</p>
                    <p className="errorMessage">{view.errorMessage02}</p>
                </div>
            </div>
        </div>
        </>
    );
}
