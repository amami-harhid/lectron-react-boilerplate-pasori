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
export function HistoriesPage() {
    const [pageCounter, setPageCounter] = useState<number>(0);
    const [input_date, setInput_date] = useState<string>('');
    const [data, setData] = useState<ROW[]>([]);
    const handleAllDelete = () => {
        // id=-1 の行がないので全行が消える。
        setData((prev)=> prev.filter((row)=>row.id == -1));
    };
    const handlerAdd = (row:HistoriesCardRow) => {
        const newId = data.length > 0 ? data[data.length - 1].id + 1 : 1;
        const newRow:ROW = {
            id: newId,
            fcno: row.fcno,
            name: (row.name)?row.name:'',
            kana: (row.kana)?row.kana:'',
            in: (row.date_in)?row.date_in:'',
            out: (row.date_out)?row.date_out:'',
        }
        setData([...data, newRow]);
    }
    //const histories_inputDate = useRef<HTMLInputElement>(null);
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
    const historiesView = async (date:Date) => {
        /* 
        const childNodes = historiesTbody.current?.childNodes
        if(childNodes){
            for(const item of childNodes.entries()){
                const childNode = item[1]; // item: [number, ChildNode]
                if(childNode)
                    childNode.remove();
            }            
        }
        */
        //setData([]);
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
        setData(_data);
    }
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
        setInput_date(event.target.value);
        tableChange(event);
    }

    const tableChange = async (event: React.ChangeEvent<HTMLInputElement>)=>{
        console.log('tableChange executed!');
        const own = event.target
        const date = own.valueAsDate;
        if(date){
            if(histories_dateResult && histories_dateResult.current){
                const date_str = DateUtils.dateToSqlite3Date(date);
                histories_dateResult.current.textContent = date_str;
                await historiesView(date);
            }
        }else{
            if(histories_dateResult && histories_dateResult.current){
                histories_dateResult.current.textContent = '';
            }
        }

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
                    <input type="date" value={input_date} onChange={handleInputChange}/>&nbsp;<button ref={histories_reload}>ﾘﾛｰﾄﾞ</button>
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
                    {data.map(row=>(
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
