const { ipcRenderer } = require('electron');
const moment = require('moment-timezone');

const folderPathElem = document.getElementById('folder-path');


document.getElementById('select-folder').addEventListener('click', async () => {
    const folderPath = await ipcRenderer.invoke('select-folder');
    folderPathElem.textContent = folderPath || 'No folder selected';
});

document.getElementById('answer1').addEventListener('input', async () => {
    if (document.getElementById('answer1').value === "1" || document.getElementById('answer1').value === "2") {
        document.getElementById('hidden').style.display = "block";
    } else {
        document.getElementById('hidden').style.display = "none";
        document.getElementById('status').innerHTML = '';
    }
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

    const answer1 = document.getElementById("answer1").value;
    const answer2 = document.getElementById("answer2").value;
    const statusElem = document.getElementById('status');

    const result = await ipcRenderer.invoke('rename-files', { folderPath, answer1, answer2 });
    if (result.success) {
        statusElem.textContent = 'Files renamed successfully!';
    } else {
        statusElem.textContent = `Error: ${result.message}`;
    }
});