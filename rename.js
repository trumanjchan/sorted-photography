const fs = require('fs');
const mediafileMetadata = require('mediafile-metadata');
const moment = require('moment-timezone');

async function renameFilesInFolder(data) {
    try {
        //console.log(data);
        const files = fs.readdirSync(data.folderPath);

        if (files[0] == '.DS_Store') {
            files.splice(0, 1);
        }
        let startlength = console.log(files.length);
        let undefinedcount = 0;


        if (data.answer1 == 0 && !data.answer2) {
            for (let i = 0; i < files.length; i++) {
                console.log("");
                console.log(files[i]);
                const essentials = await mediafileMetadata.getEssentials(data.folderPath + files[i]);
                console.log(essentials);  //creationDate is always in UTC, as denoted by the 'Z'.
                if (essentials === undefined) {
                    undefinedcount++;
                }

                let converted_time = moment(essentials.creationDate).local().format();

                let date = converted_time.substring(0, 10).replaceAll("-", "");
                date = date.substring(4, 10) + date.substring(0, 4);
                console.log(date);

                let time = converted_time.substring(11, 16).replaceAll(":", "");
                console.log(time);

                let original_name = files[i];

                console.log(date + '_' + time + '_' + original_name);
                fs.renameSync(data.folderPath + files[i], data.folderPath + date + '_' + time + '_' + original_name);
                console.log("");
            }
        } else if ((data.answer1 == 1 || data.answer1 == 2) && data.answer2) {
            for (let i = 0; i < files.length; i++) {
                console.log("");
                console.log(files[i]);
                const essentials = await mediafileMetadata.getEssentials(data.folderPath + files[i]);
                console.log(essentials);  //creationDate is always in UTC, as denoted by the 'Z'.
                if (essentials === undefined) {
                    undefinedcount++;
                }

                let local_time = moment(essentials.creationDate).format();
                var converted_time;
                if (data.answer1 == 1) {
                    let tzhere = moment().utcOffset();
                    //let tzthere = moment().tz('Asia/Tokyo').utcOffset()
                    let tzthere = moment().tz(data.answer2).utcOffset();
                    let utc_offset_diff = -(tzhere - tzthere);  //-960
                    //my dslr was set in my local timezone. Change creationDate from UTC to JST using utcOffset between local timezone and JST.
                    converted_time = moment(essentials.creationDate).utcOffset(utc_offset_diff).format();
                } else if (data.answer1 == 2) {
                    //my phone was in the timezone. Change creationDate from UTC to JST.
                    converted_time = moment(essentials.creationDate).utc().tz(data.answer2).format();
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
                fs.renameSync(data.folderPath + files[i], data.folderPath + date + '_' + time + '_' + original_name);
                console.log("");
            }
        } else {
            console.log("\nPlease choose valid options.\n");
        }
        let endlength = console.log(files.length);
        console.log("Same # of files before/after: " + (startlength === endlength));
        console.log("Photos not converted as exif data could not be found: " + undefinedcount);

        return true;
    } catch (err) {
        console.log(err);
    }
}

module.exports = { renameFilesInFolder };
