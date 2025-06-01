const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const rename = require('./rename');

function createWindow() {
    const win = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({ properties: ['openDirectory'] });
    let dirPath = result.filePaths[0];

    if (dirPath && !dirPath.endsWith(path.sep)) {
        dirPath += path.sep;
    }
    console.log(dirPath)
    return dirPath;
});

ipcMain.handle('rename-files', async (event, folderPath) => {
    try {
        rename.renameFilesInFolder(folderPath);
        return { success: true };
    } catch (error) {
        return { success: false, message: error.message };
    }
});