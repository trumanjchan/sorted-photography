import fs from 'node:fs';
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);

import { input } from '@inquirer/prompts';
import mediafileMetadata from "mediafile-metadata";
import moment from 'moment-timezone';


const timezonelist = ["", "America/Los_Angeles", "America/New_York", "Asia/Tokyo", "Australia/Sydney"];

const answer = await input({ message: 'List of Timezones:\n(0) Local\n(1) PST\n(2) EDT\n(3) JST\n(4) EST\nConvert to:' });

if (answer == 0) {
    console.log(moment().local().format());
} else if (timezonelist[answer]) {
    var tzthere = moment().tz(timezonelist[answer]).utcOffset();
    
    if (files[0] == '.DS_Store') {
        files.splice(0,1);
    }
    
    console.log(files.length);
    
    for (let i = 0; i < files.length; i++) {
        const essentials = await mediafileMetadata.getEssentials(folderPath + files[i]);
        console.log(essentials);
        
        let tzhere = moment().utcOffset();
        //let tzthere = moment().tz('Asia/Tokyo').utcOffset()
        let utc_offset_diff = -(tzhere - tzthere);  //-960
        
        let local_time = moment(essentials.creationDate).format();
        let converted_time = moment(essentials.creationDate).utcOffset(utc_offset_diff).format();
        
        console.log(local_time);
        console.log(converted_time);

        let date = converted_time.substring(0, 10).replaceAll("-", "");
        date = date.substring(4, 10) + date.substring(0, 4);
        console.log(date);

        let time = converted_time.substring(11, 16).replaceAll(":", "");
        console.log(time);

        let original_name = files[i];

        console.log(date + '_' + time + '_' + original_name);
        fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '_' + original_name);
    }
    console.log(files.length);
} else {
    console.log("\nPlease choose a valid option.\n");
}