import { useRef, useState } from "react";
export function TopPage() {
    const [count, setCount] = useState(false); // trueのとき入室中！実験用
    const pageTitleSpan = useRef<HTMLSpanElement>(null);
    const pasoriModal = useRef<HTMLDivElement>(null);
    const statusDivP = useRef<HTMLParagraphElement>(null);

    // カードタッチしたときの処理
    window?.pasoriCard.onTouch(async (idm:string)=>{
        if(idm.length==0){
            // 安全のために空チェック
            return;
        }
        // idmが登録されている利用者を取得する
        const cards = [];
        if(idm != '0000'){
            cards.push(idm);
        }
        // 登録されていないとき、モーダルを表示（登録がありません）、ブザーを鳴らす
        if(statusDivP.current && pasoriModal.current){
            if(cards.length==0){
                // 実験用
                statusDivP.current.textContent = "登録がありません";
            }else{
                // 実験用
                if(count){
                    statusDivP.current.textContent = "退室しました";
                }else{
                    statusDivP.current.textContent = "入室しました";
                }
                setCount(!count);
            }
            pasoriModal.current.style.display = 'block';
 
        }
 
    });
    // カードが離れたときの処理
    window?.pasoriCard.onRelease(async (/*idm:string*/)=>{
        // モーダルが表示されているときは モーダルを非表示にする
        if(pasoriModal.current && statusDivP.current){
            pasoriModal.current.style.display = 'none';
            statusDivP.current.textContent = '';
        }
    });
    return (
        <>
        <h1 className="pageTitle"><span ref={pageTitleSpan}>Now Stating up!</span></h1>
        <div className="modal" ref={pasoriModal}>
            <div className="modal-content">
                <div className="card"><p ref={statusDivP}></p></div>
            </div>
        </div>
        </>
    );
}
