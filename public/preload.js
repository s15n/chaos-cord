const { ipcRenderer, contextBridge } = require('electron');

console.log('Preload.js');

contextBridge.exposeInMainWorld(
  'electron',
  {
    ping: () => ipcRenderer.send('ping'),
    windowButton: (action) => ipcRenderer.send('window-button', action)
  }
);