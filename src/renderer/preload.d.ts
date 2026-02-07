import {
  ElectronHandler,
  ElectronNavigate,
  ElectronPasoriCard,
  ElectronProduct
//  ElectronPasoriDb
 } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    navigate: ElectronNavigate;
    pasoriCard: ElectronPasoriCard;
    is: ElectronProduct;
//    pasoriDb: ElectronPasoriDb;
  }
}

export {};
