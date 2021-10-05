const path = require('path');
const spawn = require('child_process').spawn;

const { app, BrowserWindow, ipcMain, globalShortcut, Tray } = require('electron')
let isDev;
try { isDev = require('electron-is-dev'); }
catch { isDev = false; }

const { udp, disconnectUDP, receiveKey } = require('./udp/udp');

/**
 * @type {BrowserWindow}
 */
let window;
function createWindow() {
    window = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: false,
        backgroundColor: '#272727',
        paintWhenInitiallyHidden: false,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        },
        icon: __dirname + '/favicon.ico'
    });

    window.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    window.setMenu(null);

    window.setOverlayIcon(new Tray(__dirname + '/badge-11.ico'))
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('ping', () => {
    //console.log('pong');
});

ipcMain.on('window-button', (_, action) => {
    switch (action) {
    case 'close': window.close(); break;
    case 'maximize':
        if (window.isMaximized()) { 
            window.unmaximize();
        } else { 
            window.maximize();
        } 
        break;
    case 'minimize': window.minimize(); break;
    }
});

ipcMain.on('dev-tools', () => {
    console.log('Opening dev tools...');
    window.webContents.openDevTools();
});

ipcMain.on('reload-page', () => {
    console.log('Reloading...');
    window.reload();
    //window.setOverlayIcon(__dirname + '/assets/badge-11.ico', 'unread')
});

ipcMain.on('open-game-url', (_, url) => {
    console.log(`Starting game ${url}`);
    openGameUrl(url);
});

ipcMain.on('udp', (event, ip, port, ssrc) => {
    console.log(`UDP ${ip}:${port} ssrc=${ssrc}`);
    udp(ip, port, ssrc, (p_ip, p_port) => {
        console.log(`Reply back ${p_ip}:${p_port}`);
        event.reply('udp-reply', p_ip, p_port);
    });
})

ipcMain.on('udp-disconnect', () => {
    console.log('Disconnecting UDP');
    disconnectUDP();
});

ipcMain.on('udp-key', (_, key) => {
    console.log('Received voice key');
    receiveKey(key);
});

ipcMain.on('pcm', (_, ...data) => {
    //console.log(data);
    window.webContents.send('pcm', ...data);
});

function openGameUrl(url) {
    spawn("cmd.exe", [
        "/c",
        "start",
        url
    ]);
}