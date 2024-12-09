// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent, webFrame } from 'electron';

export type Channels = 'ipc-example';

const LOCAL_STORAGE_KEYS = ['selectedSavedCCTVs', 'notSelectedSavedCCTVs'];
LOCAL_STORAGE_KEYS.map(key => {
  console.log('in preload.js', window.localStorage.getItem(key));
  JSON.parse(window.localStorage.getItem(key))
});


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
      // console.log(webFrame.getResourceUsage());
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    off(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.off(channel,  func);
    },
    getVersion() {
      return ipcRenderer.invoke('getVerion');
    },
    onResetLocalStorage: (callback) => {
      console.log('###### setup resetLocalStorage handler')
      ipcRenderer.on('resetLocalStorage', (event, key) => callback(key));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
