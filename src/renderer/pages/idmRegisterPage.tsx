import { useState } from "react";
import Select, {SingleValue, ActionMeta} from "react-select";
import { RenderService } from "@/service/render";
import { toast } from 'sonner';
import * as PasoriCard from './pasoriCard/pasoriCard';
import { Cards } from '@/db/cards/cards';
import { CardRow } from "@/db/cards/cardRow";

type CardOption = {
  value: string,
  label: string,
}
interface IViewData  {
    guidance: string,
    idm: string,
    card_fcno: string,
    card_name: string,
    card_kana: string,
    card_message: string,
    detailOn: string,
    idmOn: string,
    selectOn: string,
    registOn: string,
    deleteOn: string,
    confirm_On: string,
    confirm_message: string,
    cardsOptions: CardOption[],
    selectedValue: SingleValue<CardOption>,
    now_regist: boolean,
    now_delete: boolean,
}

const Display = {
  block: 'block',
  inline_block: 'inline-block',
  none: 'none',
} as const;

const viewData: IViewData = {
    guidance: '',
    idm: '',
    card_fcno: '',
    card_name: '',
    card_kana: '',
    card_message: '',
    detailOn: '',
    idmOn: '',
    selectOn: Display.block,
    registOn: Display.none,
    deleteOn: Display.none,
    confirm_On: Display.none,
    confirm_message: '',
    cardsOptions: [], // 初期値は空配列
    selectedValue: null,
    now_regist:false,
    now_delete:false,
}
export function IdmRegisterPage() {
    const [view, setView] = useState<IViewData>(viewData);

    const setPageView = ( _view: IViewData ) => {
        const _clone = structuredClone(_view);
        setView(_clone);
    }

    /** IDMを登録するときの確認モーダルを表示 */
    const register = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>):void => {
        view.now_regist = true;
        view.now_delete = false;
        view.confirm_On = Display.block;
        view.confirm_message = 'カードにIDMを登録しますか？'
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        setPageView( view );
    }
    /** IDMの登録を切るときの確認モーダルを表示 */
    const remover = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        view.now_regist = false;
        view.now_delete = true;
        view.confirm_On = Display.block;
        view.confirm_message = 'カードからIDM登録を削除しますか？'
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        setPageView( view );

    }

    /** 確認モーダルではいのとき */
    const confirm_yes_button = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const fcno = view.card_fcno;
        const idm = view.idm;
        if( view.now_regist === true) {
            // fcno を指定して cardを読み込む
            await RenderService.exe<number>(Cards.linkIdmByFcno.name, fcno, idm);
            toast.success("IMD登録しました");

            view.card_message = 'IDMを登録しました';
            // 選択を書き換える
            await redrawSelect(idm);

        }else if( view.now_delete === true) {
            await RenderService.exe<number>(Cards.releaseIdmByFcno.name, fcno);
            toast.warning("IMD登録削除しました");
            view.card_message = 'IDM登録を削除しました';
            // 選択を書き換える
            await redrawSelect(idm);
        }

        view.confirm_On = Display.none;
        view.confirm_message = '';
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        view.now_regist = false;
        view.now_delete = false;
        setPageView( view );
    }

    /** 確認モーダルでいいえのとき */
    const confirm_no_button = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        view.now_regist = false;
        view.now_delete = false;
        view.card_message = '';
        view.confirm_On = Display.none;
        view.confirm_message = '';
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        setPageView( view );

    }
    /** 選択リストを選択したとき */
    const selectCardChange = async (newValue: SingleValue<CardOption>, actionMeta: ActionMeta<CardOption>) => {
        if(view && newValue) {
            const fcno:string = newValue.value;
            view.idmOn = Display.block;
            view.selectOn = Display.none;
            if(fcno != view.card_fcno) {
                // fcno を指定して cardを読み込む
                const row: CardRow = await RenderService.exe<CardRow>(Cards.selectRowByFcno.name, fcno);
                if(row){
                    view.selectOn = Display.block;
                    view.idm = view.idm;
                    view.card_fcno = row.fcno;
                    view.card_name = (row.name)?row.name:'';
                    view.card_kana = (row.kana)?row.kana:'';
                    view.card_message = '';
                    const card_idm = row.idm;
                    if( card_idm == '') {
                        // カードに紐づいていないとき
                        view.detailOn = Display.block;
                        view.registOn = Display.inline_block;
                        view.deleteOn = Display.none;
                    }else{
                        view.detailOn = Display.block;
                        view.deleteOn = Display.inline_block;
                        view.card_message = `IDM=${card_idm}は紐づいている`;
                    }
                    view.guidance = 'ICカードをタッチしてください';
                    setPageView( view );
                }else{
                    view.idmOn = Display.block;
                    view.selectOn = Display.none;
                    view.detailOn = Display.none;
                    view.card_fcno = '';
                    view.card_name = '';
                    view.card_kana = '';
                    view.registOn = Display.none;
                    view.deleteOn = Display.none;
                    view.confirm_On = Display.none;
                    view.card_message =  `Cards:FCNO=(${fcno})が見つかりません`;
                    view.guidance = 'ICカードをタッチしてください';
                    setPageView( view );
                }

            }
        }
    }

    /** 選択リストを作る */
    const redrawSelect = async (ipc_idm:string) => {
        const idmRow: CardRow = await RenderService.exe<CardRow>(Cards.selectRowByIdm.name, ipc_idm);
        if(idmRow) {
            // タッチしたIDMが登録済のとき
            view.card_fcno = idmRow.fcno;
            view.card_name = (idmRow.name)?idmRow.name:'';
            view.card_kana = (idmRow.kana)?idmRow.kana:'';
            view.cardsOptions = [];
            view.deleteOn = Display.block; // 削除ボタン表示
            view.idmOn = Display.block;
            view.selectOn = Display.none;
            view.card_message =  ``;
            view.detailOn = Display.block;
            setPageView(view);
        }else{
            // タッチしたIDMが未登録のとき
            // idm未登録のCardsを取り出す
            const rows: CardRow[] = await RenderService.exe<CardRow[]>(Cards.selectRowsEmptyIdm.name);
            const options:CardOption[] = [];
            for(const _row of rows) {
                const option:CardOption = {
                    value: _row.fcno,
                    label: `${_row.name}(${_row.fcno})`,
                }
                options.push(option);
            }
            view.idm = ipc_idm;
            view.detailOn = Display.none;
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
            if(options.length>0){
                view.card_message =  `登録するメンバーを選択しましょう`;
                view.selectOn = Display.block;
            }else{
                view.card_message =  `登録できるメンバーがいません`;
                view.selectOn = Display.none;
            }
            view.guidance = '登録メンバー選択';

            setPageView(view);
        }


    };

    /** カードが触った */
    const cardOnTouch = async(ipc_idm:string)=>{
        view.idm = ipc_idm;
        view.idmOn = Display.block;
        await redrawSelect(ipc_idm);
    };

    /** カードが離れた */
    const cardOnRelease = async(ipc_idm:string) => {
        view.idmOn = Display.none;
        view.selectOn = Display.none;
        view.detailOn = Display.none;
        view.idm = '';
        view.card_fcno = '';
        view.card_name = '';
        view.card_kana = '';
        view.registOn = Display.none;
        view.deleteOn = Display.none;
        view.confirm_On = Display.none;
        view.confirm_message = '';
        view.now_regist = false;
        view.now_delete = false;
        view.cardsOptions = [];
        view.selectedValue = null;
        view.guidance = 'ICカードをタッチしてください';
        view.card_message =  ``;
        setPageView(view);
    }

    PasoriCard.onRelease( cardOnRelease );
    PasoriCard.onTouch( cardOnTouch );

    return (
        <>
        <div className="modal_manager">
            <div className="modal-content">
                <h2>管理者の操作</h2>
                <h4>{view.guidance}</h4>
                <div className="card_manager" >
                    <p style={{display:view.idmOn}}>IDM&nbsp;(<span>{view.idm}</span>)</p>
                    <div style={{display:view.selectOn}}>
                        <Select
                        options={view.cardsOptions}
                        value={view.selectedValue}
                        onChange={selectCardChange}
                        isClearable
                        placeholder="選択してください"
                        />
                    </div>
                    <div style={{display: view.detailOn}}>
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
                <div style={{width:'80%', marginLeft:'10%', display: "flex", justifyContent: "space-between"}}>
                    <button onClick={confirm_yes_button}>はい</button>
                    <button onClick={confirm_no_button}>いいえ</button>
                </div>
                <p></p>
            </div>
        </div>
        </>
    );
}
