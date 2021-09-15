//import path from 'path';

//import { app, BrowserWindow } from 'electron';
//import isDev from 'electron-is-dev';

const path = require('path');

const { app, BrowserWindow } = require('electron')
const isDev = require('electron-is-dev');

function createWindow() {
    const window = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        window.webContents.openDevTools({ mode: 'detach' });
    }

    window.setMenu(null);
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