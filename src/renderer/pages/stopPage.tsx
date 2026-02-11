import * as PasoriCard from '@/renderer/pages/pasoriCard/pasoriCard';
export function StopPage() {

    // カードが離れたときの処理
    PasoriCard.onRelease(async()=>{});
    // カードタッチしたときの処理
    PasoriCard.onTouch(async ()=>{});

    return (
      <div id="stopPanel" className ="mainPanel">
            <div className="PasoriTop">
            <h1>停止中</h1>
            </div>
        </div>
    );
}