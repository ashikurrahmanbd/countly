import chokidar from 'chokidar';
import { app, BrowserWindow, ipcMain } from 'electron';
import fs from 'fs';
import os from 'os';
import path from 'path';


let totalLines = 0;

app.on('ready', () => {

    const mainWindow = new BrowserWindow({

        width: 600,
        height: 200,
        resizable: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(app.getAppPath(), '/src/electron/preload.js'), // Adjust path as needed
            contextIsolation: true, // Recommended for security
            enableRemoteModule: false // Disable remote module
        },
        
    });

    mainWindow.setMenu(null);

    

    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html' ));

    startFileWatcher();

});

// file watcher
function startFileWatcher() {

    const userHomeDir = os.homedir();

     // Watch the user's home directory (or any specific folder)
     const watcher = chokidar.watch(userHomeDir, {
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true
    });

    watcher.on('change', (filePath) => {
        if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx') || filePath.endsWith('.css') || filePath.endsWith('.json') || filePath.endsWith('.js') || filePath.endsWith('.ts') || filePath.endsWith('.html')) {
            countLines(filePath);
        }
    });



}

//count lines
function countLines(filePath) {

    const lines = fs.readFileSync(filePath, 'utf-8').split('\n').length;
    console.log(`File: ${filePath} has ${lines} lines`);
    // Here, you would update your UI or database with the count
}

// Listen for line count updates
ipcMain.on('line-count', (event, lineCount) => {
    // You can broadcast this to all renderer processes or update the specific one
    mainWindow.webContents.send('line-count-update', lineCount);
});

