const fs = require('node:fs');
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);

console.log(files.length);