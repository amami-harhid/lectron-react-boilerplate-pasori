import { useRef, useState } from "react";
import * as Histories from '../../db/histories/histories';
import { HistoriesCardRow } from '../../db/histories/historiesRow';
import * as DateUtils from '../../utils/dateUtils';

type TABLE_ROW = {
    id:number,
    fcno:string,
    name:string,
    kana:string,
    in:string,
    out:string,
}
type PAGEINFO = {
    date: string,
    tableData: TABLE_ROW[],
}
const CHANNEL_SQL_REQUEST = 'asynchronous-sql-command';
const CHANNEL_SQL_REPLY = 'asynchronous-sql-reply';
export function HistoriesPage() {
    const [pageInfo, setPageInfo] = useState<PAGEINFO>({date:'', tableData:[]});
    const histories_dateResult = useRef<HTMLSpanElement>(null);

    const select = async (date:Date): Promise<HistoriesCardRow[]> => {
        console.log('select executed');
        window.electron.ipcRenderer.sendMessage(
            CHANNEL_SQL_REQUEST,
            Histories.hist_selectByDate.name, date);
        const rows: HistoriesCardRow[]
            = await window.electron.ipcRenderer.asyncOnce<HistoriesCardRow[]>(CHANNEL_SQL_REPLY);
        return rows;
    }
    const historiesToTableData = async (date:Date):Promise<TABLE_ROW[]> => {
        const rows:HistoriesCardRow[] = await select(date);
        const _data:TABLE_ROW[] = [];
        for(const row of rows){
            const newId = _data.length > 0 ? _data[_data.length - 1].id + 1 : 1;
            const newRow:TABLE_ROW = {
                id: newId,
                fcno: row.fcno,
                name: (row.name)?row.name:'',
                kana: (row.kana)?row.kana:'',
                in: (row.date_in)?row.date_in:'',
                out: (row.date_out)?row.date_out:'',
            }
            _data.push(newRow);
        }
        return _data;
    }

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>)=>{
        const date = event.target.valueAsDate;
        if(date){
            const _rows = await historiesToTableData(date);
            const date_str = DateUtils.dateToSqlite3Date(date);
            // ここでレンダリングされる（テーブルへのデータ反映）
            pageRender(date_str, _rows);
        }else{
            // ここでレンダリングされる（テーブル初期化）
            pageRender();
        }

    }
    const pageRender = (_data:string='', _tableData:TABLE_ROW[]=[]) => {
        setPageInfo( {date:_data, tableData:_tableData} )
    }
    const pageInit = () => {
      // ページレンダリングされる
      pageRender();
    }

    return (
        <div className ="mainPanel">
            <div className="modal_histories">
                <div className="modal-content">
                    <label>日付を選択してください:
                        <input type="date" value={pageInfo.date} onChange={handleInputChange}/>
                        &nbsp;<button onClick={pageInit}>初期化</button>
                    </label>
                    <p>選択された日付: <span>{pageInfo.date}</span></p>
                </div>
                <table className="appTable">
                  <tbody>
                    <tr>
                        <th>NO</th>
                        <th>FCNO</th>
                        <th>名前</th>
                        <th>カナ</th>
                        <th>入室</th>
                        <th>退室</th>
                    </tr>
                </tbody>
                <tbody>
                    {pageInfo.tableData.map(row=>(
                       <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.fcno}</td>
                            <td>{row.name}</td>
                            <td>{row.kana}</td>
                            <td>{row.in}</td>
                            <td>{row.out}</td>
                       </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}
