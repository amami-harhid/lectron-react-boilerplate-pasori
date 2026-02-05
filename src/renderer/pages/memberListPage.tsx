'use client'
import { useRef, useMemo, useEffect, useState } from "react";
import Modal from 'react-modal';
import { useForm } from 'react-hook-form';
import { MaterialReactTable, type MRT_Row, type MRT_RowData } from 'material-react-table';
import { Box, Button, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

import * as IpcServices from '../../channel/ipcService';
import * as Cards from '../../db/cards/cards';
import { CardRow } from '../../db/cards/cardRow';

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
    mail:string,
}

type PAGEINFO = {
    view: {guidance:string},
    tableDisplay: string,
    modalDisplay: string,
    tableData: TABLE_ROW[],
    registButtonDisplay: string,
    deleteButtonDisplay: string,
    registButtonName: string,
    modalPageInfo: TABLE_ROW,
    fcnoReadOnly : boolean,
    etcReadOnly : boolean,
    isModalOpen : boolean,
}
const initPageInfo: PAGEINFO = {
    view: {guidance: ''},
    tableDisplay: Display.block,
    modalDisplay: Display.none,
    tableData: [],
    registButtonDisplay: Display.none,
    deleteButtonDisplay: Display.none,
    registButtonName: RegistName.update,
    fcnoReadOnly: false,
    etcReadOnly: false,
    modalPageInfo: {
        no: 0,
        fcno: '',
        name: '',
        kana: '',
        mail: '',
    },
    isModalOpen: false,
};
type FormValues = {
  fcno: string,
  name: string,
  kana: string,
  mail: string,
};
type CHANNEL = IpcServices.IpcChannelValOfService;
const CHANNEL_REQUEST:CHANNEL = IpcServices.IpcChannels.CHANNEL_REQUEST_QUERY;
const CHANNEL_REPLY:CHANNEL = IpcServices.IpcChannels.CHANNEL_REPLY_QUERY;

export function MemberListPage () {
    const [pageInfo, setPageInfo] = useState<PAGEINFO>(initPageInfo);
    const updatePageInfo = ( info: PAGEINFO ) => {
        const _clone = structuredClone(info);
        setPageInfo(_clone);
    }
    // TODO FORM を使わないようにする予定？
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>();
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
            accessorKey: 'mail',
            header: 'Mail',
            size: 150,
            minSize: 150,
            maxSize: 200,
            enableSorting: false,
            }
        ]
    const handleCancel = () =>{
        pageInfo.tableDisplay = Display.block;
        pageInfo.modalDisplay = Display.none;
        pageInfo.registButtonDisplay = Display.none;
        pageInfo.deleteButtonDisplay = Display.none;
        pageInfo.fcnoReadOnly = false;
        pageInfo.etcReadOnly = false;
        updatePageInfo(pageInfo);
    }
    const handleEdit = (row: MRT_Row<TABLE_ROW> ) => {
            pageInfo.modalPageInfo.no = row.original.no;
            pageInfo.modalPageInfo.fcno = row.original.fcno;
            pageInfo.modalPageInfo.name = row.original.name;
            pageInfo.modalPageInfo.kana = row.original.kana;
            pageInfo.modalPageInfo.mail = row.original.mail;
            reset(pageInfo.modalPageInfo);
            pageInfo.tableDisplay = Display.none;
            //pageInfo.modalDisplay = Display.block;
            pageInfo.modalDisplay = Display.none;
            pageInfo.isModalOpen = true;
            pageInfo.registButtonDisplay = Display.inline_block;
            pageInfo.deleteButtonDisplay = Display.none;
            pageInfo.fcnoReadOnly = true;
            pageInfo.etcReadOnly = false;
            updatePageInfo(pageInfo);
    };
    const handleDelete = (row: MRT_Row<TABLE_ROW>) => {
            pageInfo.modalPageInfo.no = row.original.no;
            pageInfo.modalPageInfo.fcno = row.original.fcno;
            pageInfo.modalPageInfo.name = row.original.name;
            pageInfo.modalPageInfo.kana = row.original.kana;
            pageInfo.modalPageInfo.mail = row.original.mail;
            reset(pageInfo.modalPageInfo);
            pageInfo.tableDisplay = Display.none;
            pageInfo.modalDisplay = Display.block;
            pageInfo.registButtonDisplay = Display.none;
            pageInfo.deleteButtonDisplay = Display.inline_block;
            pageInfo.fcnoReadOnly = true;
            pageInfo.etcReadOnly = true;
            updatePageInfo(pageInfo);
    };
    const formSubmitRegist = (data:FormValues) => {
        console.log('formSubmitRegist')
        // DBレコード上書きをする
        console.log(data);
        pageInfo.isModalOpen = false;
        pageInfo.tableDisplay = Display.block;
        updatePageInfo(pageInfo);

    }
    const formSubmitDelete = (data:FormValues) => {
        console.log('formSubmitDelete')
        // DBレコード削除をする
        console.log(data);
        pageInfo.isModalOpen = false;
        pageInfo.tableDisplay = Display.block;
        updatePageInfo(pageInfo);
    }
    const cardsSelectAll = async (): Promise<CardRow[]> => {
        // リクエスト
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_REQUEST,
            Cards.selectAll.name);
        // 応答を待つ
        const rows: CardRow[]
            = await window.electron.ipcRenderer.asyncOnce<CardRow[]>(CHANNEL_REPLY);
        return rows;
    };

    const membersToTableData = async ():Promise<void> => {
        const rows:CardRow[] = await cardsSelectAll();
        const _data:TABLE_ROW[] = [];
        for(const row of rows){
            const newId = _data.length > 0 ? _data[_data.length - 1].no + 1 : 1;
            const newRow:TABLE_ROW = {
                no: newId,
                fcno: row.fcno,
                name: (row.name)?row.name:'',
                kana: (row.kana)?row.kana:'',
                mail: (row.mail)?row.mail:'',
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

    useEffect(() => {
        membersToTableData();
    },[]);
    
    // カードが離れたときの処理
    window.pasoriCard.onRelease(async()=>{});
    // カードタッチしたときの処理
    window.pasoriCard.onTouch(async ()=>{});
    return (
        <>
        <div ref={content} className="modal_manager" >
            <div className="modal-content" style={{display: pageInfo.tableDisplay}}>
                <h2><span>利用者一覧</span></h2>
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
                    createDisplayMode="modal"
                    onCreatingRowSave={async ({ values, table }) => {
                        pageInfo.tableData = [...pageInfo.tableData, values]
                        updatePageInfo(pageInfo);
                        table.setCreatingRow(null); // Exit Create mode
                    }}
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box>
                            <Tooltip title="追加">
                                <IconButton onClick={() => table.setCreatingRow(true) /* 別のモーダルにしたい*/}>
                                    <AddIcon/>
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                    positionActionsColumn="last"
                    renderRowActions={({ row }) => (
                        <Box sx={{ display: 'flex', gap: '0.2rem' }}>
                            <Tooltip title="編集">
                                <IconButton onClick={() => handleEdit(row)}>
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="削除">
                                <IconButton color="error" onClick={() => handleDelete(row)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}
                />
            </div>
            <div style={{display:pageInfo.modalDisplay}} className="modal-content">
                <h2></h2>
                <form>
                <div>
                    <table className='member_appTable'>
                        <tbody>
                        <tr>
                            <td>FCNO</td>
                            <td><input type="text"
                                {
                                    ...register("fcno")
                                }
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>名前</td>
                            <td><input type="text" 
                                {
                                    ...register("name")
                                }
                                size={20} 
                                readOnly={pageInfo.etcReadOnly}/></td>
                        </tr>
                        <tr>
                            <td>カナ</td>
                            <td><input type="text" 
                                {
                                    ...register("kana")
                                }
                                readOnly={pageInfo.etcReadOnly}/></td>
                        </tr>
                        <tr>
                            <td>MAIL</td>
                            <td><input type="text" 
                                {
                                    ...register("mail")
                                }
                                readOnly={pageInfo.etcReadOnly}/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                </form>
                <div>
                    <p><button onClick={handleCancel}>中止</button>&nbsp;
                        <button type="submit" onClick={handleSubmit(formSubmitRegist)}
                            style={{display:pageInfo.registButtonDisplay}}>{pageInfo.registButtonName}</button>&nbsp;
                        <button type="submit" onClick={handleSubmit(formSubmitDelete)}
                            style={{display:pageInfo.deleteButtonDisplay}}>削除</button></p>
                </div>
            </div>
        </div>
        <Modal
            isOpen={pageInfo.isModalOpen}
            onRequestClose={() => {
                console.log('onRequestClose');
//                pageInfo.isModalOpen = false;
//                pageInfo.tableDisplay = Display.block;
//                updatePageInfo(pageInfo);
            }}
            style={{
                content: {
                    width: "60%",
                    height: "50%",
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    transform: 'translate(-50%, -50%)',
                    padding: '2rem',
                    zIndex: 100,
                },
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1,
                }
            }}
            >
            <h2>モーダルの中身</h2>
                <form>
                <div>
                    <table className='member_appTable'>
                        <tbody>
                        <tr>
                            <td>FCNO</td>
                            <td><input type="text"
                                {
                                    ...register("fcno")
                                }
                                size={4} 
                                readOnly={pageInfo.fcnoReadOnly}/>
                            </td>
                        </tr>
                        <tr>
                            <td>名前</td>
                            <td><input type="text" 
                                {
                                    ...register("name")
                                }
                                size={50} 
                                readOnly={pageInfo.etcReadOnly}/></td>
                        </tr>
                        <tr>
                            <td>カナ</td>
                            <td><input type="text" 
                                {
                                    ...register("kana")
                                }
                                size={50} 
                                readOnly={pageInfo.etcReadOnly}/></td>
                        </tr>
                        <tr>
                            <td>MAIL</td>
                            <td><input type="text" 
                                {
                                    ...register("mail")
                                }
                                size={50} 
                                readOnly={pageInfo.etcReadOnly}/></td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                </form>
                <div>
                    <p><button onClick={handleCancel}>中止</button>&nbsp;
                        <button type="submit" onClick={handleSubmit(formSubmitRegist)}
                            style={{display:pageInfo.registButtonDisplay}}>{pageInfo.registButtonName}</button>&nbsp;
                        <button type="submit" onClick={handleSubmit(formSubmitDelete)}
                            style={{display:pageInfo.deleteButtonDisplay}}>削除</button></p>
                </div>
            <button onClick={() => {
                pageInfo.isModalOpen = false;
                pageInfo.tableDisplay = Display.block;
                updatePageInfo(pageInfo);
            }}>閉じる</button>
        </Modal>
        </>
    );
}
