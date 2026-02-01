import { ChangeEvent, useRef, useState, useMemo } from "react";
import * as Histories from '../../db/histories/histories';
import * as Cards from '../../db/cards/cards';
import { CardRow } from '../../db/cards/cardRow';
import { HistoriesCardRow } from '../../db/histories/historiesRow';
import * as DateUtils from '../../utils/dateUtils';

type ROW = {
    id:number,
    fcno:string,
    name:string,
    kana:string,
    in:string,
    out:string,
}
type PAGEINFO = {
    date: string,
    tableData: ROW[],
}
export function HistoriesPage() {
    const [pageInfo, setPageInfo] = useState<PAGEINFO>({date:'', tableData:[]});
    const [input_date, setInput_date] = useState<string>('');
    const [data, setData] = useState<ROW[]>([]);
    const histories_reload = useRef<HTMLButtonElement>(null);
    const histories_dateResult = useRef<HTMLSpanElement>(null);
    const historiesTbody = useRef<HTMLTableSectionElement>(null);

    const select = async (date:Date): Promise<HistoriesCardRow[]> => {
        console.log('select executed');
        window.electron.ipcRenderer.sendMessage(
            'asynchronous-sql-command',
            Histories.hist_selectByDate.name, date);
        const rows: HistoriesCardRow[] 
            = await window.electron.ipcRenderer.asyncOnce<HistoriesCardRow[]>('asynchronous-sql-reply');    
        return rows;
    }
    const historiesView = async (date:Date):Promise<ROW[]> => {
        const rows:HistoriesCardRow[] = await select(date);
        const _data:ROW[] = [];
        for(const row of rows){
            const newId = _data.length > 0 ? _data[_data.length - 1].id + 1 : 1;
            const newRow:ROW = {
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
        console.log('tableChange executed!');
        const own = event.target
        const date = own.valueAsDate;
        const rows:ROW[] = []
        if(date){
            if(histories_dateResult && histories_dateResult.current){
                const date_str = DateUtils.dateToSqlite3Date(date);
                histories_dateResult.current.textContent = date_str;
                rows.push(...await historiesView(date));
                setPageInfo( {date:date_str, tableData:rows} )
            }
        }else{
            dateInit();
        }

    }
    const dateInit = () => {
        setPageInfo( {date:'', tableData:[]} )
    }
    console.log('addEventLister change')
    //setPageCounter(pageCounter+1);
//    histories_inputDate.current?.removeEventListener('change', tableChange);
//    histories_inputDate.current?.addEventListener('change', tableChange);
    return (
        <div className ="mainPanel">
            <div className="modal_histories">
                <div className="modal-content">
                    <label htmlFor="histories_inputDate">日付を選択してください:</label>
                    <input type="date" value={pageInfo.date} onChange={handleInputChange}/>&nbsp;<button onClick={dateInit}>初期化</button>
                    <p>選択された日付: <span ref={histories_dateResult}></span></p>
                </div>
                <table id="histories_table" className="appTable">
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
                <tbody ref={historiesTbody}>
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
