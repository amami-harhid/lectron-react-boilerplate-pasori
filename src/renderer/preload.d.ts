import {
  ElectronHandler,
  ElectronNavigate,
  ElectronPasoriCard,
  ElectronProduct
 } from '@/main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    navigate: ElectronNavigate;
    pasoriCard: ElectronPasoriCard;
    buildEnv: ElectronProduct;
  }
}

export {};
