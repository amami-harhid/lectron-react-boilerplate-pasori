export function StopPage() {

    // カードが離れたときの処理
    window.pasoriCard.onRelease(async()=>{});
    // カードタッチしたときの処理
    window.pasoriCard.onTouch(async ()=>{});

    return (
      <div id="stopPanel" className ="mainPanel">
            <div className="PasoriTop">
            <h1>停止中</h1>
            </div>
        </div>
    );
}