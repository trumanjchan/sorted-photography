import fs from 'node:fs';
const rootfiles = fs.readdirSync('./');
var rootFolder;
for (let i = 0; i < rootfiles.length; i++) {
    if (rootfiles[i] == '.git' || rootfiles[i] == 'node_modules') {
        continue;
    }

    if (fs.existsSync(rootfiles[i]) && fs.lstatSync(rootfiles[i]).isDirectory()) {
        rootFolder = rootfiles[i];
        console.log("Found folder: " + rootfiles[i]);
    }
}
const folderPath = './' + rootFolder + '/';
const files = fs.readdirSync(folderPath);

import { input } from '@inquirer/prompts';
import mediafileMetadata from "mediafile-metadata";
import moment from 'moment-timezone';


const timezonelist = ["America/Los_Angeles", "America/New_York", "Asia/Tokyo"];

const answer1 = await input({ message: '\n(0) Don\'t care what timezone the pictures were taken in - Convert to Local Timezone\n(1) Photos taken in Local Timezone --CONVERT--> X Timezone\n(2) Photos taken in correct Timezone --CONVERT--> X Timezone\nOption:' });  //don't care about timezone vs my dslr pics vs my phone pics
var answer2;
if (answer1 == 0) {
    answer2 = null;
} else {
    answer2 = await input({ message: 'List of Timezones:\n(0) PST\n(1) EDT\n(2) JST\nConvert to:' });
}

if (files[0] == '.DS_Store') {
    files.splice(0,1);
}
let startlength = console.log(files.length);
let undefinedcount = 0;
if (answer1 == 0 && answer2 == null) {
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        const essentials = await mediafileMetadata.getEssentials(folderPath + files[i]);
        console.log(essentials);  //creationDate is always in UTC, as denoted by the 'Z'.
        if (essentials === undefined) {
            undefinedcount++;
            continue;
        }

        let converted_time = moment(essentials.creationDate).local().format();

        let date = converted_time.substring(0, 10).replaceAll("-", "");
        date = date.substring(4, 10) + date.substring(0, 4);
        console.log(date);

        let time = converted_time.substring(11, 16).replaceAll(":", "");
        console.log(time);

        let original_name = files[i];

        console.log(date + '_' + time + '_' + original_name);
        fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '_' + original_name);
    }
} else if ((answer1 == 1 || answer1 == 2) && timezonelist[answer2]) {
    for (let i = 0; i < files.length; i++) {
        console.log(files[i]);
        const essentials = await mediafileMetadata.getEssentials(folderPath + files[i]);
        console.log(essentials);  //creationDate is always in UTC, as denoted by the 'Z'.
        if (essentials === undefined) {
            undefinedcount++;
            continue;
        }
        
        let local_time = moment(essentials.creationDate).format();
        var converted_time;
        if (answer1 == 1) {
            let tzhere = moment().utcOffset();
            //let tzthere = moment().tz('Asia/Tokyo').utcOffset()
            let tzthere = moment().tz(timezonelist[answer2]).utcOffset();
            let utc_offset_diff = -(tzhere - tzthere);  //-960
            //my dslr was set in my local timezone. Change creationDate from UTC to JST using utcOffset between local timezone and JST.
            converted_time = moment(essentials.creationDate).utcOffset(utc_offset_diff).format();
        } else if (answer1 == 2) {
            //my phone was in the timezone. Change creationDate from UTC to JST.
            converted_time = moment(essentials.creationDate).utc().tz(timezonelist[answer2]).format();
        }
        
        console.log(local_time + "   Local Timezone");
        console.log(converted_time + "   Converted Timezone");

        let date = converted_time.substring(0, 10).replaceAll("-", "");
        date = date.substring(4, 10) + date.substring(0, 4);
        console.log(date);

        let time = converted_time.substring(11, 16).replaceAll(":", "");
        console.log(time);

        let original_name = files[i];

        console.log(date + '_' + time + '_' + original_name);
        fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '_' + original_name);
    }
} else {
    console.log("\nPlease choose valid options.\n");
}
let endlength = console.log(files.length);
console.log("Same # of files before/after: " + (startlength === endlength));
console.log("Photos not converted as exif data could not be found: " + undefinedcount);