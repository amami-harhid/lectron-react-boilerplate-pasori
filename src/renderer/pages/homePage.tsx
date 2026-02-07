import { useEffect, useState } from "react";
import * as PasoriCard from './pasoriCard/pasoriCard';
import * as Sounds from '@/renderer/lib/sounds';

type View = {
    isReady: string,
    errorMessage01: string,
    errorMessage02: string,
}
const intView:View = {
    isReady: '',
    errorMessage01: '',
    errorMessage02: '',
}
export const HomePage = () =>  {
    const [view, setView] = useState<View>(intView);
    const setPageView = ( _view: View ) => {
        const _clone = structuredClone(_view);
        setView(_clone);
    }
    const isReaderReady = async () => {
        const _isReady = await window.pasoriCard.isCardReady();
        if(_isReady) {
            view.isReady = 'TRUE';
            view.errorMessage01 = '操作⇒読取開始で始めましょう'
        }else{
            view.isReady = 'FALSE';
            view.errorMessage01 = 'カードリーダー接続を確認できません'
            view.errorMessage02 = '接続し再起動してください'
        }
        setPageView(view);
    }
        
    PasoriCard.onRelease(async ()=>{});
    PasoriCard.onTouch(async ()=>{});

    useEffect(()=>{
        isReaderReady();
        console.log('home useEffect')
        // 音を取り込む。
        Sounds.preload();
    },[])
    
    return (
        <>
          <div className="card">
            <p className="errorMessage">{view.errorMessage01}</p>
            <p className="errorMessage">{view.errorMessage02}</p>
          </div>
        </>
    );
}
