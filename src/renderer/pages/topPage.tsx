import { useRef } from "react";
export function TopPage() {
    const mainPanel = useRef(null);
    const pasoriModal = useRef<HTMLDivElement>(null);
    const statusDiv = useRef(null);
    window?.pasoriCard.onTouch(async (idm:string)=>{
        // CARDタッチしたときの処理
        if(idm.length==0){
            // 安全のために空チェック
            return;
        }
        // idmが登録されている利用者を取得する
        // 登録されていないとき、モーダルを表示（登録がありません）、ブザーを鳴らす
        if(pasoriModal.current){
            pasoriModal.current.style.display = 'block';
        }

    });
    window?.pasoriCard.onRelease(async (idm:string)=>{
        // CARDが離れたときの処理
        // モーダルが表示されているときは モーダルを非表示にする
        if(pasoriModal.current){
            pasoriModal.current.style.display = 'none';
        }
    });
    return (
        <>
        <div className ="mainPanel" ref={mainPanel}>
            <div className="PasoriTop">
                <h1>カードをタッチしてね</h1>
            </div>
        </div>
        <div className="modal" ref={pasoriModal}>
            <div className="modal-content">
                <div id="statusDiv" className="card" ref={statusDiv}></div>
            </div>
        </div>
        </>
    );
}
