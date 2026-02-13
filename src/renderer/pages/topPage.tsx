import { useRef, useEffect, useState } from "react";
import { toast } from 'sonner';
import { topPageService } from '@/service/ipcRenderer/topPageRenderer';
import * as PasoriCard from '@/renderer/pages/pasoriCard/pasoriCard';
import { HistoriesMemberIdmRow } from "@/db/histories/historiesRow";

import * as Sounds from "@/renderer/lib/sounds";

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
    const cardsSelectCardRow = async (idm:string): Promise<HistoriesMemberIdmRow | undefined> => {
        const row: HistoriesMemberIdmRow = await topPageService.getMemberByIdm(idm);
        return row;
    };
    const setInRoom = async(fcno:string, idm: string) : Promise<void> => {
        // Cards/履歴を更新
        await topPageService.setInRoomByFcno(fcno, idm, true);
    }
    const setOutRoom = async(fcno:string, idm: string) : Promise<void> => {
        await topPageService.setInRoomByFcno(fcno, idm, false);
    }

    /** カードリリース */
    const cardRelease = () => {
        view.status = '';
        view.modal_display = Display.none;
        setPageView(view);
    }
    /** カードタッチ */
    const cardTouch = async (idm :string) => {
        if(idm.length==0){
            // 安全のために空チェック
            return;
        }
        // idmが登録されている利用者を取得する
        const row = await cardsSelectCardRow(idm);
        if(row) {
            //console.log('カードタッチ row, idm=',row, idm);
            const fcno = row.fcno;
            if( row.in_room == true ) {
                //console.log('カードタッチ OUT row, idm=',row, idm);
                // 入室中
                Sounds.play({name:"CARD_OUT"})
                await setOutRoom( fcno, idm);
                if(row.mail != ''){
                    // 退室通知メール
                    const mailResult = await topPageService.sendMail(row.mail, false, row.name);
                    if(mailResult==false){
                      toast.warning('メール送信失敗');
                    }
                }
                view.status = '退室しました';
                view.name = `(${row.name}さん)`;
            }else{
                // 退室中
                //console.log('カードタッチ IN row, idm=',row, idm);
                Sounds.play({name:"CARD_IN"});
                await setInRoom( fcno, idm);
                if(row.mail != ''){
                    // 入室通知メール
                    const mailResult = await topPageService.sendMail(row.mail, true, row.name);
                    if(mailResult==false){
                      toast.warning('メール送信失敗');
                    }
                }
                view.status = '入室しました';
                view.name = `(${row.name}さん)`;
            }
        }else{
            Sounds.play({name:"CARD_NG"})
            view.status = `未登録カード(${idm})`;
            view.name = ``
        }
        //console.log('カードタッチ view.status=',view.status);
        view.modal_display = Display.block;
        setPageView(view);

    }

    /** カードリーダー準備完了確認 */
    const isReaderReady = async () => {
        view.is_ready  = true;
        const isReady = await window.pasoriCard.isCardReady();
        if(isReady){
          view.card_display = Display.block;
          view.error_display = Display.none;
          view.errorMessage01 = ``;
          view.errorMessage02 = ``;
          // カードリーダー接続していたらリッスン開始
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

    const cardTouchListenerStart = () => {
        // カードが離れたときの処理
        PasoriCard.onRelease( async(ipc_idm:string)=>{
            cardRelease();
        });

        // カードタッチしたときの処理
        PasoriCard.onTouch( async (idm:string)=>{
            await cardTouch(idm);
        });
    }

    useEffect(()=>{
        view.modal_display = Display.none,
        view.is_ready = false;
        isReaderReady();
    },[]);

    return (
        <>
        {/* モーダル */}
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
