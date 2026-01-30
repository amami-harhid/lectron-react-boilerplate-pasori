import { StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import ReactDOM from 'react-dom';

import {App} from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

// calling IPC exposed from preload script
window.electron?.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron?.ipcRenderer.sendMessage('ipc-example', ['ping']);

export const asyncSql = async (sql:string) => {
    return new Promise((resolve) => {
        window.electron?.ipcRenderer.once('asynchronous-sql-reply', (arg:any) => {
            resolve(arg)
        });
        window.electron?.ipcRenderer.sendMessage('asynchronous-sql-command', sql);
    })
}
