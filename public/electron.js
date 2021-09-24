const path = require('path');
const spawn = require('child_process').spawn;

const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
let isDev;
try { isDev = require('electron-is-dev'); }
catch { isDev = false; }

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
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        }
    });

    window.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        //window.webContents.openDevTools({ mode: 'detach' });
    }

    window.setMenu(null);
    //window.maximize();
}

app.whenReady()/*.then(() => {
    globalShortcut.register('F5', () => {
      console.log('Reloading...');
      window.reload();
    });
    globalShortcut.register('CommandOrControl+Shift+I', () => {
      console.log('Opening dev tools...');
      window.webContents.openDevTools();
    });
})*/.then(createWindow);

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
});

ipcMain.on('open-game-url', (_, url) => {
    console.log(`Starting game ${url}`)
    openGameUrl(url)
});

function openGameUrl(url) {
    spawn("cmd.exe", [
        "/c",
        "start",
        url
    ]);
}