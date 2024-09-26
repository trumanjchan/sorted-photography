const fs = require('node:fs');
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);
var ExifImage = require('exif').ExifImage;

console.log("Start: " + files.length);

const templetter = ["a", "b", "c", "d"];  //needs work

for (let i = 0; i < files.length; i++) {
    try {
        new ExifImage({ image : folderPath + files[i] }, function (error, exifData) {
            if (error)
                return;
            else
                console.log(exifData.exif.DateTimeOriginal);
                var date = exifData.exif.DateTimeOriginal.substring(0, 10).replaceAll(":", "");
                var time = exifData.exif.DateTimeOriginal.substring(11, 16).replaceAll(":", "");
                date = date.substring(4, 10) + date.substring(0, 4);

                if (fs.existsSync(folderPath + date + '_' + time + '.JPG')) {  //needs work
                    fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + templetter[0] + '.JPG');
                } else if (fs.existsSync(folderPath + date + '_' + time + templetter[0] + '.JPG')) {
                    fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + templetter[1] + '.JPG');
                } else if (fs.existsSync(folderPath + date + '_' + time + templetter[1] + '.JPG')) {
                    fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + templetter[2] + '.JPG');
                } else if (fs.existsSync(folderPath + date + '_' + time + templetter[2] + '.JPG')) {
                    fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + templetter[3] + '.JPG');
                } else {
                    fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '.JPG');
                }
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}