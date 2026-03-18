const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // We can add IPC functions here if needed
  checkUpdate: () => ipcRenderer.send('check-update'),
  getVersion: () => ipcRenderer.invoke('get-app-version')
});
