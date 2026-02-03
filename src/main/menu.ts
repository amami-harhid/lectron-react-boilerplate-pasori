import {
  app,
  Menu,
  shell,
  BrowserWindow,
  MenuItemConstructorOptions,
} from 'electron';

import { MenuChannel } from './menuConstants';
import { appVersion } from '../version';

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
  selector?: string;
  submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

const CARD_MANAGE = '#CardManage';
const GENERAL = '#Genaral';
const GENERAL_STOP = '#Genaral_STOP';
const MEMBERS = '#MEMBERS';
const DEV_TOOL = "#DEV_TOOL";
const APP_VERSION = "#APP_VERSION";
const HISTORIES = "#HISTORIES";

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu(): Menu {
    if (
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
    ) {
      this.setupDevelopmentEnvironment();
    }

    const template =
      process.platform === 'darwin'
        ? this.buildDarwinTemplate()
        : this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  setupDevelopmentEnvironment(): void {
    this.mainWindow.webContents.on('context-menu', (_, props) => {
      const { x, y } = props;

      Menu.buildFromTemplate([
        {
          label: 'Inspect element',
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          },
        },
      ]).popup({ window: this.mainWindow });
    });
  }

  buildDarwinTemplate(): MenuItemConstructorOptions[] {
    const subMenuAbout: DarwinMenuItemConstructorOptions = {
      label: 'Electron',
      submenu: [
        {
          label: 'About ElectronReact',
          selector: 'orderFrontStandardAboutPanel:',
        },
        { type: 'separator' },
        { label: 'Services', submenu: [] },
        { type: 'separator' },
        {
          label: 'Hide ElectronReact',
          accelerator: 'Command+H',
          selector: 'hide:',
        },
        {
          label: 'Hide Others',
          accelerator: 'Command+Shift+H',
          selector: 'hideOtherApplications:',
        },
        { label: 'Show All', selector: 'unhideAllApplications:' },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    };
    const subMenuEdit: DarwinMenuItemConstructorOptions = {
      label: 'Edit',
      submenu: [
        { label: 'Undo', accelerator: 'Command+Z', selector: 'undo:' },
        { label: 'Redo', accelerator: 'Shift+Command+Z', selector: 'redo:' },
        { type: 'separator' },
        { label: 'Cut', accelerator: 'Command+X', selector: 'cut:' },
        { label: 'Copy', accelerator: 'Command+C', selector: 'copy:' },
        { label: 'Paste', accelerator: 'Command+V', selector: 'paste:' },
        {
          label: 'Select All',
          accelerator: 'Command+A',
          selector: 'selectAll:',
        },
      ],
    };
    const subMenuViewDev: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'Command+R',
          click: () => {
            this.mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'Alt+Command+I',
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          },
        },
      ],
    };
    const subMenuViewProd: MenuItemConstructorOptions = {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Full Screen',
          accelerator: 'Ctrl+Command+F',
          click: () => {
            this.mainWindow.setFullScreen(!this.mainWindow.isFullScreen());
          },
        },
      ],
    };
    const subMenuWindow: DarwinMenuItemConstructorOptions = {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'Command+M',
          selector: 'performMiniaturize:',
        },
        { label: 'Close', accelerator: 'Command+W', selector: 'performClose:' },
        { type: 'separator' },
        { label: 'Bring All to Front', selector: 'arrangeInFront:' },
      ],
    };
    const subMenuHelp: MenuItemConstructorOptions = {
      label: 'Help',
      submenu: [
        {
          label: 'Learn More',
          click() {
            shell.openExternal('https://electronjs.org');
          },
        },
        {
          label: 'Documentation',
          click() {
            shell.openExternal(
              'https://github.com/electron/electron/tree/main/docs#readme',
            );
          },
        },
        {
          label: 'Community Discussions',
          click() {
            shell.openExternal('https://www.electronjs.org/community');
          },
        },
        {
          label: 'Search Issues',
          click() {
            shell.openExternal('https://github.com/electron/electron/issues');
          },
        },
      ],
    };

    const subMenuView =
      process.env.NODE_ENV === 'development' ||
      process.env.DEBUG_PROD === 'true'
        ? subMenuViewDev
        : subMenuViewProd;

    return [subMenuAbout, subMenuEdit, subMenuView, subMenuWindow, subMenuHelp];
  }
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: '操作',
        submenu: [
          {
            label: '読取開始',
            id: GENERAL,
            click() {
              toGeneral();
            },
          },
          {
            label: '読込停止',
            id: GENERAL_STOP,
            click() {
              toGeneralStop();
            },
          },
          {
            label: 'メンバー一覧',
            id: MEMBERS,
            click() {
              toMember();
            },
          },
          {
            label: 'カード管理',
            id: CARD_MANAGE,
            click() {
              toManager();
            },
          },
        ],
      },
      {
        label: '履歴',
        submenu: [
          {
            label: '入退室履歴',
            id: HISTORIES,
            enabled: true,
            click: () => {
                    viewHistories();
            }
          },
        ]
      },
      {
        label: 'HELP',
        submenu: [
          {
                label: '開発者ツール',
                id: DEV_TOOL,
                enabled: true,
                click: () => {
                    openDevTool();
                }
          },
          {
              label: 'Reload',
              click: () => {
                  this.mainWindow.webContents.reload();
              },
          },
          {
              label: 'VERSION',
              id: APP_VERSION,
              enabled: true,
              click: () => {
                  viewAppVersion();
              }
          },
          {
              label: '登録なしカード',
              enabled: true,
              click: () => {
                  const browserWindows = BrowserWindow.getFocusedWindow();
                  browserWindows?.webContents.send('card-touch', '0000');
              }
          },
          {
              label: 'カードタッチ',
              enabled: true,
              click: () => {
                  const browserWindows = BrowserWindow.getFocusedWindow();
                  browserWindows?.webContents.send('card-touch', '123456');
              }
          },
          {
              label: 'カード離す',
              enabled: true,
              click: () => {
                  const browserWindows = BrowserWindow.getFocusedWindow();
                  browserWindows?.webContents.send('card-release', '');
              }
          },

        ]
      },
    ];

    return templateDefault;
  }
}

const getMenuItemById = ( id: string): Electron.MenuItem => {
    const menu = Menu.getApplicationMenu();
    if(menu){
      const menuItem = menu.getMenuItemById(id);
      if(menuItem){
        return menuItem;
      }
    }
    throw new Error(`Unable get menuItem id=${id}`);
}
const setEnableToMenuItem = (id:string, enabled:boolean): void => {
    const menuItem = getMenuItemById(id);
    menuItem.enabled = enabled;
}
const sendMessage = (messageId: string, ...args:string[]): void => {
    const browserWindow = BrowserWindow.getFocusedWindow();
    if( browserWindow ) {
      browserWindow.webContents.send(messageId, ...args);
    }
}

const toManager = ()=>{
    setEnableToMenuItem(GENERAL, false);
    setEnableToMenuItem(GENERAL_STOP, false);
    setEnableToMenuItem(CARD_MANAGE, false);
    setEnableToMenuItem(MEMBERS, true);
    setEnableToMenuItem(HISTORIES, true);
    sendMessage("navigate", "/IdmRegister");
    sendMessage(MenuChannel.APP_MANAGER_HANDLING);
}
const toGeneral = () => {
    setEnableToMenuItem(GENERAL, false);
    setEnableToMenuItem(GENERAL_STOP, true);
    setEnableToMenuItem(CARD_MANAGE, true);
    setEnableToMenuItem(MEMBERS, true);
    setEnableToMenuItem(HISTORIES, false);
    sendMessage("navigate", "/Top");
    //sendMessage(MenuChannel.APP_GENERAL_HANDLING);
}
const toGeneralStop = () => {
    setEnableToMenuItem(GENERAL, true);
    setEnableToMenuItem(GENERAL_STOP, false);
    setEnableToMenuItem(CARD_MANAGE, true);
    setEnableToMenuItem(MEMBERS, true);
    setEnableToMenuItem(HISTORIES, true);
    sendMessage("navigate", "/Stop");
    //sendMessage(MenuChannel.APP_GENERAL_STOP_HANDLING);
}
const toMember = () => {
    setEnableToMenuItem(GENERAL, true);
    setEnableToMenuItem(GENERAL_STOP, false);
    setEnableToMenuItem(CARD_MANAGE, true);
    setEnableToMenuItem(MEMBERS, false);
    setEnableToMenuItem(HISTORIES, true);
    sendMessage("navigate", "/MemberListPage")
}
const openDevTool = () => {
    const browser = BrowserWindow.getFocusedWindow();
    if(browser){
        browser.webContents.openDevTools(); // 開発者ツールを表示
    }
}
const viewAppVersion = () => {
    const version = appVersion();
    sendMessage(MenuChannel.APP_VERSION_HANDLING, version);
}
const viewHistories = () => {
    setEnableToMenuItem(GENERAL, true);
    setEnableToMenuItem(GENERAL_STOP, false);
    setEnableToMenuItem(CARD_MANAGE, true);
    setEnableToMenuItem(MEMBERS, true);
    setEnableToMenuItem(HISTORIES, true);
    sendMessage("navigate", "/Histories");
}
