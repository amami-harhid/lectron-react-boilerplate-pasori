import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Select, {SingleValue, ActionMeta} from "react-select";
import * as IpcServices from '../../channel/ipcService';
import * as Cards from '../../db/cards/cards';
import { CardRow } from "../../db/cards/cardRow";

type CHANNEL = IpcServices.IpcChannelValOfService;
const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;

type CardOption = {
  value: string,
  label: string,
}
interface IViewData  {
    idm: string,
    card_fcno: string,
    card_name: string,
    card_kana: string,
    card_message: string,
    registOn: string,
    deleteOn: string,
    confirm_On: string,
    confirm_message: string,
    cardsOptions: CardOption[],
    now_regist: boolean,
    now_delete: boolean,
}

const Display = {
  block: 'block',
  inline_block: 'inline-block',
  none: 'none',
} as const;

const viewData: IViewData = {
    idm: '',
    card_fcno: '',
    card_name: '',
    card_kana: '',
    card_message: '',
    registOn: Display.none,
    deleteOn: Display.none,
    confirm_On: Display.none,
    confirm_message: '',
    cardsOptions: [], // 初期値は空配列
    now_regist:false,
    now_delete:false,
}
export function IdmRegisterPage() {
    const [view, setView] = useState<IViewData>(viewData);

    const location = useLocation();
    const from = location.state?.from || "不明";
    console.log('from=', from);
    useEffect(() => {
        console.log('useEffect ------')
    },[from]);

    const setPageView = ( _view: IViewData ) => {
        const _clone = structuredClone(_view);
        setView(_clone);
    }

    const register = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        // idmを紐づける確認モーダルを表示
        view.now_regist = true;
        view.now_delete = false;
        view.confirm_On = Display.block;
        view.confirm_message = 'カードにIDMを登録しますか？'
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        setPageView( view );
    }

    const remover = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // idmの紐づを切る確認モーダルを表示
        view.now_regist = false;
        view.now_delete = true;
        view.confirm_On = Display.block;
        view.confirm_message = 'カードからIDM登録を削除しますか？'
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        setPageView( view );

    }

    const confirm_yes_button = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // 確認モーダルでYESのとき
        const fcno = view.card_fcno;
        const idm = view.idm;
        if( view.now_regist === true) {
            // fcno を指定して cardを読み込む
            // リクエスト
            window.electron.ipcRenderer.sendMessage(
                CHANNEL_REQUEST,
                Cards.cards_linkIdmByFcno.name, fcno, idm); // fcno指定依頼
            // 応答を待つ
            const count: number
                  = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);

            view.card_message = 'IDMを登録しました';
        }else if( view.now_delete === true) {
            // リクエスト
            window.electron.ipcRenderer.sendMessage(
                CHANNEL_REQUEST,
                Cards.cards_releaseIdmByFcno.name, fcno); // fcno指定依頼
            // 応答を待つ
            const count: number
                  = await window.electron.ipcRenderer.asyncOnce<number>(CHANNEL_REPLY);

            view.card_message = 'IDM登録を削除しました';
        }else{
            console.log('登録、削除のどちらでもない')
        }

        view.confirm_On = Display.none;
        view.confirm_message = '';
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        view.now_regist = false;
        view.now_delete = false;
        setPageView( view );
    }
    const confirm_no_button = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // 確認モーダルでNOのとき

        view.now_regist = false;
        view.now_delete = false;
        view.card_message = '';
        view.confirm_On = Display.none;
        view.confirm_message = '';
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        setPageView( view );

    }

    const selectCardChange = async (newValue: SingleValue<CardOption>, actionMeta: ActionMeta<CardOption>) => {
        // 選択されたとき
        console.log('[1]viewData=',view);
        if(view && newValue) {
            const fcno:string = newValue.value;
            if(fcno != view.card_fcno) {
                // fcno を指定して cardを読み込む
                // リクエスト
                window.electron.ipcRenderer.sendMessage(
                    CHANNEL_REQUEST,
                    Cards.cards_selectRowByFcno.name, fcno); // fcno指定依頼

                console.log('[2]viewData=',view);
                // 応答を待つ
                const row: CardRow
                  = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
                console.log('selected row=', row);
                console.log('[3]viewData=',view);
                if(row != undefined){
                    console.log('[4]viewData=',view);
                    view.idm = view.idm;
                    view.card_fcno = row.fcno;
                    view.card_name = (row.name)?row.name:'';
                    view.card_kana = (row.kana)?row.kana:'';
                    view.card_message = '';
                    const card_idm = row.idm;
                    if( card_idm == '') {
                        // カードに紐づいていないとき
                        view.registOn = Display.inline_block;
                        view.deleteOn = Display.none;
                    }else{
                        view.deleteOn = Display.inline_block;
                        view.card_message = `IDM=${card_idm}は紐づいている`;
                    }
                    console.log('[5]viewData=',view);
                    setPageView( view );
                }else{
                    view.card_fcno = '';
                    view.card_name = '';
                    view.card_kana = '';
                    view.registOn = Display.none;
                    view.deleteOn = Display.none;
                    view.confirm_On = Display.none;
                    view.card_message =  `Cards:FCNO=(${fcno})が見つかりません`;
                    setPageView( view );
                }
            }
        }
    }

    window.pasoriCard.onTouch( async(ipc_idm:string)=>{
        console.log('ipc_idm=',ipc_idm);
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.cards_selectRowsEmptyIdm.name); // idm未登録のCardsを取り出す依頼
        console.log('wait-----');
        // 応答を待つ
        const rows: CardRow[]
            = await window.electron.ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        console.log('rows=',rows);
        const options:CardOption[] = [];
        for(const _row of rows) {
            const option:CardOption = {
                value: _row.fcno,
                label: `${_row.name}(${_row.fcno})`,
            }
            options.push(option);
        }
        view.idm = ipc_idm;
        view.card_fcno = '';
        view.card_name = '';
        view.card_kana = '';
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        view.confirm_On = Display.none;
        view.confirm_message = '';
        view.now_regist = false;
        view.now_delete = false;
        view.cardsOptions = [...options];
        console.log('[1]view=',view)
        if(rows.length == 0){
            // リクエスト( タッチされた idm 紐づいた Cardsを取り出す)
            window.electron.ipcRenderer.sendMessage(
                CHANNEL_REQUEST,
                Cards.cards_selectRowByIdm.name, ipc_idm); // idm指定依頼
            // 応答を待つ
            const row: CardRow
                  = await window.electron.ipcRenderer.asyncOnce<CardRow>(CHANNEL_REPLY);
            if(row){
                view.card_fcno = row.fcno;
                view.card_name = (row.name)?row.name:'';
                view.card_kana = (row.kana)?row.kana:'';
                view.deleteOn = Display.block; // 削除ボタン表示
            }else{
                view.card_message = `登録されているべきIDM${ipc_idm}が登録されていない`;
            }
            console.log('[2]view=',view)
        }else{
            console.log('[3]view=',view)
        }
        console.log('[4]view=',view)
        setPageView(view);
    });

    return (
        <>
        <div className="modal_manager">
            <div className="modal-content">
                <h2>管理者の操作</h2>
                <h4>ICカードをタッチしてください</h4>
                <div className="card_manager">
                    <p>IDM&nbsp;(<span>{view.idm}</span>)</p>
                    <div >
                        <Select
                        options={view.cardsOptions}
                        onChange={selectCardChange}
                        placeholder="選択してください"
                        />
                    </div>
                    <div >
                        <p>FC-NO&nbsp;(<span>{view.card_fcno}</span>)</p>
                        <p>名前&nbsp;(<span>{view.card_name}</span>)</p>
                        <p>カナ&nbsp;(<span>{view.card_kana}</span>)</p>
                    </div>
                    <p>
                        <button style={{display: view.registOn}} onClick={register}>登録</button>&nbsp;
                        <button style={{display: view.deleteOn}} onClick={remover} >削除</button></p>
                    <p className="card_message"><span>{view.card_message}</span></p>
                </div>
            </div>
        </div>
        <div style={{display: view.confirm_On}} className="confirm">
            <div>
                <p>{view.confirm_message}</p>
                <button onClick={confirm_yes_button}>はい</button>
                <button onClick={confirm_no_button}>いいえ</button>
            </div>
        </div>
        </>
    );
}
