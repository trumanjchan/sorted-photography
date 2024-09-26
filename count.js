/* run this file with 'node count.js' */
const fs = require('node:fs');
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);

console.log("Count: " + files.length);