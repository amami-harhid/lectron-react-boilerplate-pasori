'use client'
import { useRef, useEffect, useState } from "react";
import Modal from 'react-modal';
import { MaterialReactTable, type MRT_Row } from 'material-react-table';
import { Box, IconButton, Tooltip } from '@mui/material';
import RecoverIcon from '@mui/icons-material/RestoreFromTrashSharp';
import DeleteIcon from '@mui/icons-material/DeleteForever';

import * as IpcServices from '../../channel/ipcService';
import * as PasoriCard from './pasoriCard/pasoriCard';
import * as Cards from '../../db/cards/cards';
import * as Histories from '../../db/histories/histories';
import { CardRow } from '../../db/cards/cardRow';

type TABLE_ROW = {
    no:number,
    fcno:string,
    name:string,
    kana:string,
}
const TypeRegist = {
    None: '',
    Recover: 'recover',
    Delete: 'delete',
} as const;
type TTypeRegist =  (typeof TypeRegist)[keyof typeof TypeRegist];
type PAGEINFO = {
    tableData: TABLE_ROW[],
    typeRegist: TTypeRegist,
    confirmTitle: string,
    confirmGuide: string,
    isConfirmOpen: boolean,
    tempData: TABLE_ROW,
    counter: number,
}
const initPageInfo: PAGEINFO = {
    tableData: [],
    typeRegist: '',
    confirmTitle: '',
    confirmGuide: '',
    isConfirmOpen: false,
    tempData: {no: 0, fcno:'', name:'', kana:''},
    counter: 0,
};
type CHANNEL = IpcServices.IpcChannelValOfService;
const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;

/**
 * 論理削除されたメンバーを一覧化し、選択したメンバーを復旧させる、
 * または、完全削除する。
 */
export function MemberTrashedListPage () {
    const [pageInfo, setPageInfo] = useState<PAGEINFO>(initPageInfo);
    const updatePageInfo = ( info: PAGEINFO ) => {
        const _clone = structuredClone(info);
        setPageInfo(_clone);
    }
    const redrawPageInfo = ( info: PAGEINFO ) => {
        info.counter += 1;
        updatePageInfo(info);
    }

    // モーダルを表示するための設定
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
            }
        ]
    const handleRecover = (row: MRT_Row<TABLE_ROW> ) => {
        pageInfo.isConfirmOpen = true;
        pageInfo.typeRegist = TypeRegist.Recover;
        pageInfo.confirmTitle = '復活させますか';
        pageInfo.confirmGuide = '';
        pageInfo.tempData = {
            no: 0,
            fcno: row.original.fcno,
            name: '',
            kana: '',
        }
        updatePageInfo(pageInfo);
    };
    const handleDelete = (row: MRT_Row<TABLE_ROW>) => {
        pageInfo.isConfirmOpen = true;
        pageInfo.typeRegist = TypeRegist.Delete;
        pageInfo.confirmTitle = '完全削除しますか';
        pageInfo.confirmGuide = '元に戻せません、構いませんか？';
        pageInfo.tempData = {
            no: 0,
            fcno: row.original.fcno,
            name: '',
            kana: '',
        }
        updatePageInfo(pageInfo);
    };

    /** 論理削除中のメンバーを取り出す */ 
    const cardsSelectAllSoftDeleted = async (): Promise<CardRow[]> => {
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.selectAllSoftDeleted.name);
        // 応答を待つ
        const rows: CardRow[]
            = await window.electron.ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return rows;
    };

    /** 論理削除されたメンバー一覧を作成する */
    const membersToTableData = async ():Promise<void> => {
        const rows:CardRow[] = await cardsSelectAllSoftDeleted();
        const _data:TABLE_ROW[] = [];
        for(const row of rows){
            const newId = _data.length > 0 ? _data[_data.length - 1].no + 1 : 1;
            const newRow:TABLE_ROW = {
                no: newId,
                fcno: row.fcno,
                name: (row.name)?row.name:'',
                kana: (row.kana)?row.kana:'',
            }
            console.log(newRow)
            _data.push(newRow);
        }
        pageInfo.tableData = _data;
        updatePageInfo(pageInfo);
    }

    const reload = () => {
        membersToTableData();
    }

    const confirmYes = async () => {
        pageInfo.isConfirmOpen = false;
        const data = pageInfo.tempData;
        if(pageInfo.typeRegist==TypeRegist.Recover){
            // リクエスト
            window.electron.ipcRenderer.sendMessage(
                CHANNEL_REQUEST,
                Cards.recoveryByFcno.name, data.fcno);
            // 応答を待つ
            await window.electron.ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
            pageInfo.isConfirmOpen = false;
            redrawPageInfo(pageInfo);

        }else if(pageInfo.typeRegist == TypeRegist.Delete){
            // 物理削除する（履歴も削除）
            // リクエスト
            window.electron.ipcRenderer.sendMessage(
                CHANNEL_REQUEST,
                Cards.deletePhisycalByFcno.name, data.fcno);
            // 応答を待つ
            await window.electron.ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
            // リクエスト
            window.electron.ipcRenderer.sendMessage(
                CHANNEL_REQUEST,
                Histories.deleteHistoriesByFcno.name, data.fcno);
            // 応答を待つ
            await window.electron.ipcRenderer.asyncOnce<boolean>(CHANNEL_REPLY);
            pageInfo.isConfirmOpen = false;
            redrawPageInfo(pageInfo);

        }else{
            redrawPageInfo(pageInfo);
            return;
        }
    }
    const confirmNo = () => {
        pageInfo.isConfirmOpen = false;
        updatePageInfo(pageInfo);
    }

    // カードが離れたときの処理
    PasoriCard.onRelease(async()=>{});
    // カードタッチしたときの処理
    PasoriCard.onTouch(async ()=>{});

    useEffect(() => {
        console.log('----useEffect----')
        reload();
    },[pageInfo.counter]);

    return (
        <>
        <div ref={content} className="modal_manager" >
            <div className="modal-content">
                <h2><span>削除済の利用者一覧</span></h2>
                <div><button onClick={reload}>リロード</button></div>
                <h4></h4>
                <MaterialReactTable
                    columns={columns}
                    data={pageInfo.tableData}
                    muiTableProps={{
                        className: 'member_appTable',
                    }}
                    enableRowActions
                    enableSorting
                    createDisplayMode="modal"
                    onCreatingRowSave={async ({ values, table }) => {
                        // 何もしない。
                    }}
                    positionActionsColumn="last"
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', gap: '0.2rem' }}>
                            <Tooltip title="復活させる">
                                <IconButton onClick={() => handleRecover(row)}>
                                    <RecoverIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="完全削除">
                                <IconButton color="error" onClick={() => handleDelete(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                />
            </div>
        </div>
        <Modal
            isOpen={pageInfo.isConfirmOpen}
            onRequestClose={() => {
                // モーダルの外をクリックしたときに
                // ここに来る。
            }}
            style={{
                content: {
                    width: "30%",
                    height: "25%",
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    padding: '2rem',
                    zIndex: 102,
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 2,
                }
            }}
            >
            <div style={{margin:'0', textAlign:'center'}}>
                <h1 style={{margin:'0'}}>{pageInfo.confirmTitle}</h1>
                <h2 style={{color:'red', fontSize:'smaller'}}>{pageInfo.confirmGuide}</h2>
                <div className="modal-button-container">
                    <button className="modal-btn" onClick={confirmNo}
                        >いいえ</button>
                    <button className="modal-alert-btn" onClick={confirmYes}
                        >はい</button>
                </div>
            </div>
        </Modal>
        </>
    );
}
