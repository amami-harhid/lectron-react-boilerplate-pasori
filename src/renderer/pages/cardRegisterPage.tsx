import { useRef, useState } from "react";
export const URL = './cardRegisterPage';
export function CardRegisterPage() {
    const pasoriModal_manager_div = useRef<HTMLDivElement>(null);
    const card_manager_div = useRef<HTMLDivElement>(null);
    const card_idm_span = useRef<HTMLSpanElement>(null);
    const card_empty_idm_div = useRef<HTMLDivElement>(null);
    const fcno_select = useRef<HTMLSelectElement>(null);
    const card_has_idm_div = useRef<HTMLDivElement>(null);
    const card_fcno_span = useRef<HTMLSpanElement>(null);
    const card_name_span = useRef<HTMLSpanElement>(null);
    const card_kana_span = useRef<HTMLSpanElement>(null);
    const card_edit_p = useRef<HTMLParagraphElement>(null);
    const card_regist_button = useRef<HTMLButtonElement>(null);
    const card_delete_button = useRef<HTMLButtonElement>(null);
    const confirm_div = useRef<HTMLDivElement>(null);
    const confirm_p = useRef<HTMLParagraphElement>(null);
    const confirm_yes_button = useRef<HTMLButtonElement>(null);
    const confirm_no_button = useRef<HTMLButtonElement>(null);
    if(card_manager_div && card_manager_div.current && 
            confirm_div && confirm_div.current){
        card_manager_div.current.style.display = 'none';
        confirm_div.current.style.display = 'none';
    }
    const [idm, setIdm] = useState('');

    
    window.pasoriDb.cardRequest("cards", )
    return (
        <>
        <div ref={pasoriModal_manager_div} className="modal_manager">
            <div className="modal-content">
                <h2>管理者の操作</h2>
                <h4>ICカードをタッチしてください</h4>
                <div ref={card_manager_div} className="card_manager">
                    <p>IDM&nbsp;(<span ref={card_idm_span}>{idm}</span>)</p>
                    <div ref={card_empty_idm_div}>
                        <select ref={fcno_select}></select>
                    </div>
                    <div ref={card_has_idm_div}>
                        <p>FC-NO&nbsp;(<span ref={card_fcno_span}></span>)</p>
                        <p>名前&nbsp;(<span ref={card_name_span}></span>)</p>
                        <p>カナ&nbsp;(<span ref={card_kana_span}></span>)</p>
                    </div>
                    <p ref={card_edit_p}><button ref={card_regist_button}>登録</button>&nbsp;
                        <button ref={card_delete_button}>削除</button></p>
                    <p className="card_message"><span id="card_message_span"></span></p>
                </div>
            </div>
        </div>
        <div ref={confirm_div} className="confirm">
            <div>
                <p ref={confirm_p}></p>
                <button ref={confirm_yes_button}>はい</button>
                <button ref={confirm_no_button}>いいえ</button>
            </div>
        </div>
        </>
    );
}
