import { contextBridge, ipcRenderer } from 'electron';

// Expose the line count update function to the renderer
contextBridge.exposeInMainWorld('electron', {
    onLineCountUpdate: (callback) => {
        ipcRenderer.on('line-count-update', (event, lineCount) => {
            callback(lineCount);
        });
    },
    // Optionally, you can expose other functions as needed
});