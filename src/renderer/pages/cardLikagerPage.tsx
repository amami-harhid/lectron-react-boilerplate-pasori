import { useRef, useState } from "react";
export function CardLinkagePage() {
    const pasoriModal_manager = useRef<HTMLDivElement>(null);
    const card_manager = useRef<HTMLDivElement>(null);
    const card_idm = useRef<HTMLSpanElement>(null);
    const card_empty_idm = useRef<HTMLDivElement>(null);
    const fcno_select = useRef<HTMLSelectElement>(null);
    const card_has_idm = useRef<HTMLDivElement>(null);
    const card_fcno = useRef<HTMLSpanElement>(null);
    return (
        <>
        <div ref={pasoriModal_manager} className="modal_manager">
            <div className="modal-content">
                <h2>管理者の操作</h2>
                <h4>ICカードをタッチしてください</h4>
                <div ref={card_manager} className="card_manager">
                    <p>IDM&nbsp;(<span ref={card_idm}></span>)</p>
                    <div ref={card_empty_idm}>
                        <select ref={fcno_select}></select>
                    </div>
                    <div ref={card_has_idm}>
                        <p>FC-NO&nbsp;(<span ref={card_fcno}></span>)</p>
                        <p>名前&nbsp;(<span id="card_name"></span>)</p>
                        <p>カナ&nbsp;(<span id="card_kana"></span>)</p>
                    </div>
                    <p id="card_edit"><button id="card_regist">登録</button>&nbsp;<button id="card_delete">削除</button></p>
                    <p className="card_message"><span id="card_message_span"></span></p>
                </div>
            </div>
        </div>
        <div id="confirm" className="confirm">
            <div>
                <p id="confirm_p"></p>
                <button id="confirm-yes">はい</button><button id="confirm-no">いいえ</button>
            </div>
        </div>
        </>
    );
}
