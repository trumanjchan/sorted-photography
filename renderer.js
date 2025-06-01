const { ipcRenderer } = require('electron');

const folderPathElem = document.getElementById('folder-path');
const statusElem = document.getElementById('status');

document.getElementById('select-folder').addEventListener('click', async () => {
    const folderPath = await ipcRenderer.invoke('select-folder');
    folderPathElem.textContent = folderPath || 'No folder selected';
});

document.getElementById('rename-files').addEventListener('click', async () => {
    const folderPath = folderPathElem.textContent;
    if (!folderPath || folderPath === 'No folder selected') {
        alert('Please select a folder.');
        return;
    }

    const answer1 = document.getElementById("answer1").value;
    const answer2 = document.getElementById("answer2").value;

    const result = await ipcRenderer.invoke('rename-files', { folderPath, answer1, answer2 });
    if (result.success) {
        statusElem.textContent = 'Files renamed successfully!';
    } else {
        statusElem.textContent = `Error: ${result.message}`;
    }
});