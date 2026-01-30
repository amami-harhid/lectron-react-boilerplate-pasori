import { ipcMain } from 'electron';
import { BrowserWindow } from 'electron';
import { NFC, Reader } from "nfc-pcsc";
import { Logger } from "../log/logger";
import { CardReaderID } from './cardEventID';

interface ICCard {
  uid: string; // とりあえず uid を使えるようにする
}

const logger = new Logger()
const nfc = new NFC(logger);
type TReader = typeof Reader;

const getMainBrowser = ():BrowserWindow => {
    const browsers = BrowserWindow.getAllWindows();
    if(browsers && browsers.length > 0){
        const browser = browsers[0];
        return browser;
    }
    throw new Error('Not found browserWindow');
}

export class CardReader {
    private enableRead:boolean = false;
    private _logger:Logger;
    constructor(logger:Logger) {
        this.enableRead = true;
        this._logger = {
            info: logger.info,
            warn: logger.warn,
            debug: (...args:any)=>{
                console.log(...args);
                logger.debug(...args);
            },
            error: (...args:any)=>{
                console.log(...args);
                logger.error(...args);
            },
        };
    }

    ready() {
        ipcMain.on(CardReaderID.CARD_START, ()=>{
            this.enableRead = true;
        })
        ipcMain.on(CardReaderID.CARD_STOP, ()=>{
            this.enableRead = false;
        })
        const browser = getMainBrowser();
        const cardTouch = async (card:ICCard) => {
            const uid = card.uid;
            if(this.enableRead && uid && uid.length>0){
                browser.webContents.send(CardReaderID.CARD_TOUCH, uid);
                const msg = `CARD TOUCH uid=(${uid})`;
                this._logger.debug(msg);
            }else{
                const msg = `CANT SEND uid=(${uid})`;
                this._logger.error(msg);
            }
        }
        const cardRelease = async (card:ICCard) => {
            const uid = card.uid;
            browser.webContents.send(CardReaderID.CARD_RELEASE, uid);
            const msg = `CARD TOUCH uid=(${uid})`;
            this._logger.debug(msg);
        }

        nfc.on('reader', (reader:TReader)=>{
            const device_name = reader.reader.name;
            this._logger.debug(`Device ready device=(${device_name})`);
            // TODO デバイスを認識したときに Renderer側へ伝えたい。準備完了を表示させたい。
            reader.on('card', cardTouch);
            reader.on('card.off', cardRelease);
            reader.on('end', () => {
                const msg = `device removed device=(${device_name})`
                this._logger.debug(msg);
            });
        });
    }
}