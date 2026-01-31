import { 
  ElectronHandler, 
  ElectronNavigate, 
  ElectronPasoriCard, 
  ElectronPasoriDb } from '../main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    navigate: ElectronNavigate;
    pasoriCard: ElectronPasoriCard;
    pasoriDb: ElectronPasoriDb;
  }
}

export {};
