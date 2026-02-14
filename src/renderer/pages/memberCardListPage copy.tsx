import { useRef, useMemo, useEffect, useState } from "react";
import Modal from 'react-modal';
import { MaterialReactTable, type MRT_Row, type MRT_RowData } from 'material-react-table';
import { Box, Icon, IconButton, Tooltip } from '@mui/material';
import CardIcon from '@/icons/Card';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/PersonAdd';
import { toast } from 'sonner';

import { memberCardListService } from "@/service/ipcRenderer/memberCardListRenderer";
import * as PasoriCard from '@/renderer/pages/pasoriCard/pasoriCard';
import { MemberRow } from "@/db/members/memberRow";

const Display = {
    block: 'block',
    none: 'none',
    inline_block: 'inline-block',
}
const RegistName = {
    update: '更新',
    add: '追加',
}
type TABLE_ROW = {
    no:number,
    fcno:string,
    name:string,
    kana:string,
    idm:string,
}
type PAGEINFO = {
    view: {guidance:string},
    tableData: TABLE_ROW[],
    isCardRegistModalOpen: boolean,
    isCardRemoveModalOpen: boolean,

    modalPageInfo: TABLE_ROW,
    isModalOpen : boolean,
    isConfirmOpen: boolean,
    tempData: TABLE_ROW,
    counter: number,
}
const initPageInfo: PAGEINFO = {
    view: {guidance: ''},
    tableData: [],
    isCardRegistModalOpen: false,
    isCardRemoveModalOpen: false,

    modalPageInfo: { no: 0, fcno: '', name: '', kana: '', idm: ''},
    isModalOpen: false,
    isConfirmOpen: false,
    tempData: {no: 0, fcno:'', name:'', kana:'', idm: ''},
    counter: 0,
};

export function MemberCardListPage () {
    const [pageInfo, setPageInfo] = useState<PAGEINFO>(initPageInfo);
    const updatePageInfo = ( info: PAGEINFO ) => {
        const _clone = structuredClone(info);
        setPageInfo(_clone);
    }
    const redrawPageInfo = ( info: PAGEINFO ) => {
        info.counter += 1;
        updatePageInfo(info);
    }
    const content = useRef(null);
    const element = content.current
    if(element){
        Modal.setAppElement(element);
    }

    // Define columns
    const columns = [
        {
            accessorKey: 'no',
            header: 'NO',
            size: 20,
            minSize: 20,
            maxSize: 20,
            enableSorting: false,
        },
        {
            accessorKey: 'fcno',
            header: 'FCNO',
            size: 80,
            minSize: 80,
            maxSize: 80,
            enableSorting: false,
        },
        {
            accessorKey: 'name',
            header: '名前',
            size: 150,
            minSize: 150,
            maxSize: 200,
            enableSorting: false,
        },
        {
            accessorKey: 'kana',
            header: 'カナ',
            size: 150,
            minSize: 150,
            maxSize: 200,
        },
        {
            accessorKey: 'idm',
            header: 'カード',
            size: 50,
            minSize: 50,
            maxSize: 80,
            enableSorting: false,
        }
    ];
    const handleRegistCancel = () =>{
        pageInfo.isConfirmOpen = false;
        pasoriCardListenClear();
        updatePageInfo(pageInfo);
    }
    const handleRegist = (row: MRT_Row<TABLE_ROW> ) => {
        pageInfo.isCardRegistModalOpen = true;
        pageInfo.modalPageInfo.no = row.original.no;
        pageInfo.tempData.fcno = row.original.fcno;
        pageInfo.tempData.name = row.original.name;
        // カードが離れたときの処理
        PasoriCard.onRelease(async()=>{
            pageInfo.tempData.idm = '';
            pageInfo.isCardRegistModalOpen = false;
            pasoriCardListenClear();
            updatePageInfo(pageInfo);
        });
        // カードタッチしたときの処理
        PasoriCard.onTouch(async (idm:string)=>{
            const fcno = pageInfo.tempData.fcno;
            await memberCardListService.setIdmByFcno(fcno, idm);
            pageInfo.isCardRegistModalOpen = false;
            pasoriCardListenClear();
            toast.success('カード登録しました');
            updatePageInfo(pageInfo);
        });
        updatePageInfo(pageInfo);
    };
    const handleRemove = (row: MRT_Row<TABLE_ROW>) => {
        pageInfo.isCardRemoveModalOpen = true;
        pageInfo.tempData.fcno = row.original.fcno;
        pageInfo.tempData.name = row.original.name;
        updatePageInfo(pageInfo);
    };

    const membersToTableData = async ():Promise<void> => {
        console.log('membersToTableData start')
        const rows = await memberCardListService.getMembers();
        console.log('membersToTableData rows=',rows)
        const _data:TABLE_ROW[] = [];
        for(const row of rows){
            const newId = _data.length > 0 ? _data[_data.length - 1].no + 1 : 1;
            const newRow:TABLE_ROW = {
                no: newId,
                fcno: row.fcno,
                name: (row.name)?row.name:'',
                kana: (row.kana)?row.kana:'',
                idm: (row.idm == '')?'':'登録済'
            }
            _data.push(newRow);
        }
        console.log('_data=',_data);
        pageInfo.tableData = _data;
        updatePageInfo(pageInfo);
    }

    const reload = () => {
        membersToTableData();
    }

    // 確認モーダル（はい）--> カード情報登録解除
    const confirmYes = async () => {
        const fcno = pageInfo.tempData.fcno;
        const result = await memberCardListService.setIdmByFcno(fcno, '');
        if(result){
            toast.success("解除しました");
            pageInfo.isConfirmOpen = false;
            redrawPageInfo(pageInfo);
        }else{
            toast.warning("解除できませんでした");
        }
    }
    // 確認モーダル（いいえ）
    const confirmNo = () => {
        pageInfo.isConfirmOpen = false;
        updatePageInfo(pageInfo);
    }
    const pasoriCardListenClear = ()=>{
        // カードが離れたときの処理
        PasoriCard.onRelease(async()=>{});
        // カードタッチしたときの処理
        PasoriCard.onTouch(async ()=>{});
    }
    pasoriCardListenClear();

    // redrawPageInfo()が実行されたとき
    // リロードが実行され、メンバー一覧を最新化する仕組み
    useEffect(() => {        
        reload();
    },[pageInfo.counter]);
    console.log('before return')
    return (
        <>
        <div ref={content} className="modal_manager" >
            <div className="modal-content">
                <h2><span>利用者カード一覧</span></h2>
                <div><button onClick={reload}>リロード</button></div>
                <h4>{pageInfo.view.guidance}</h4>
                <MaterialReactTable
                    columns={columns}
                    data={pageInfo.tableData}
                    muiTableProps={{
                        className: 'member_appTable',
                    }}
                    enableRowActions
                    enableSorting
                    positionActionsColumn="last"
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', gap: '0.2rem' }}>
                            <Tooltip title="登録" arrow placement="top">
                                <IconButton color="primary" onClick={() => handleRegist(row)} 
                                {...{/*
                                        disabled={row.original.idm != ''}
                                */}}
                                    >
                                    <CardIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="解除" arrow placement="top">
                                <IconButton color="error" onClick={() => handleRemove(row)} 
                                {...{/*
                                        disabled={row.original.idm == ''}
                                */}}
                                    >
                                    <CardIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                        
                    )}
                />
            </div>
        </div>
        {{/* カード登録モーダル */}}
        <Modal
            isOpen={pageInfo.isCardRegistModalOpen}
            onRequestClose={() => {
                // モーダルの外をクリックしたときに
                // ここに来る。
            }}
            style={{
                content: {
                    width: "50%",
                    height: "70%",
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    padding: '2rem',
                    zIndex: 1,
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                }
            }}
            >
            <h2 style={{marginBottom:10}}>カード登録</h2>
            <p></p>
            <h3><span>{pageInfo.tempData.name}</span></h3>
            <p></p>
            <h3><span>カードタッチしてください</span></h3>
            <p><span>({pageInfo.tempData.idm})</span></p>
            <div className="modal-button-container" style={{margin:20}}>
                <button className="modal-btn" onClick={()=>handleRegistCancel()}>中止</button>
            </div>
        </Modal>
        {{/* カード情報登録解除 */}}
        <Modal
            isOpen={pageInfo.isCardRemoveModalOpen}
            onRequestClose={() => {
                // モーダルの外をクリックしたときに
                // ここに来る。
            }}
            style={{
                content: {
                    width: "20%",
                    height: "20%",
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    padding: '2rem',
                    zIndex: 1,
                    border: '3px double #0090a0',
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                }
            }}
            >
            <h2 style={{margin:0}}>カード登録を削除しますか？</h2>
            <p></p>
            <div className="modal-button-container" style={{margin:5}}>
                <button className="modal-btn" onClick={()=>confirmNo()}
                        >いいえ</button>
                <button className="modal-alert-btn" onClick={()=>confirmYes()}
                        >はい</button>
            </div>
        </Modal>
        </>
    );
}
