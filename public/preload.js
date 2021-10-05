const { ipcRenderer, contextBridge, ipcMain } = require('electron');

console.log('Preload.js');

const udpReplyHandler = {
  callback: () => {
    console.log('NO UDP REPLY HANDLER');
  }
};
ipcRenderer.on('udp-reply', (_, p_ip, p_port) => {
  udpReplyHandler.callback(p_ip, p_port);
});

const pcmHandler = {
  callback: () => {
    console.log('NO PCM HANDLER');
  }
};
ipcRenderer.on('pcm', (_, ...data) => {
  pcmHandler.callback(data);
});

contextBridge.exposeInMainWorld(
  'electron',
  {
    ping: () => ipcRenderer.send('ping'),
    windowButton: (action) => ipcRenderer.send('window-button', action),
    openGameUrl: (url) => ipcRenderer.send('open-game-url', url),
    devTools: () => ipcRenderer.send('dev-tools'),
    reloadPage: () => ipcRenderer.send('reload-page'),
    udp: (ip, port, ssrc) => ipcRenderer.send('udp', ip, port, ssrc),
    disconnectUDP: () => ipcRenderer.send('udp-disconnect'),
    udpKey: (key) => ipcRenderer.send('udp-key', key),

    setUdpReplyHandler: (callback) => udpReplyHandler.callback = callback,
    setPcmHandler: (callback) => pcmHandler.callback = (data) => {
      //console.log(int);
      callback(data);
    }
  }
);

//module.exports.pcmHandler = pcmHandler