const { ipcRenderer } = require('electron');
const moment = require('moment-timezone');

const folderPathElem = document.getElementById('folder-path');


document.getElementById('select-folder').addEventListener('click', async () => {
    const folderPath = await ipcRenderer.invoke('select-folder');
    folderPathElem.textContent = folderPath || 'No folder selected';
});

document.getElementById('list-timezones').addEventListener('click', async () => {
    const country = document.getElementById('country').value;
    const zonesList = document.getElementById('timezones');

    const zones = moment.tz.zonesForCountry(country);

    zonesList.textContent = '';
    Object.entries(zones).forEach(([abbr, zone]) => {
        const div = document.createElement('div');
        div.textContent = `${zone}`;
        zonesList.appendChild(div);
    });
});

document.getElementById('rename-files').addEventListener('click', async () => {
    const folderPath = folderPathElem.textContent;
    if (!folderPath || folderPath === 'No folder selected') {
        alert('Please select a folder.');
        return;
    }

    const option1 = document.getElementById("option1").checked;
    const option2 = document.getElementById("option2").checked;
    if (!(option1 || option2)) {
        alert('Please select a renaming method.');
        return;
    }

    const convertTo = document.getElementById("convert-to").value;
    if (!convertTo) {
        alert('Please provide a valid timezone.');
        return;
    }

    const statusElem = document.getElementById('status');

    const result = await ipcRenderer.invoke('rename-files', { folderPath, option1, option2, convertTo });
    if (result.success) {
        statusElem.textContent = 'Files renamed successfully!';
    } else {
        statusElem.textContent = `Error: ${result.message}`;
    }
});