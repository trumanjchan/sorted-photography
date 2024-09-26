const fs = require('node:fs');
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);
var ExifImage = require('exif').ExifImage;

//console.log(files);
console.log(files.length);

for (let i = 0; i < files.length; i++) {
    try {
        new ExifImage({ image : folderPath + files[i] }, function (error, exifData) {
            if (error)
                return;
            else
                console.log(exifData.exif.DateTimeOriginal);
                let date = exifData.exif.DateTimeOriginal.substring(0, 10).replaceAll(":", "");
                let time = exifData.exif.DateTimeOriginal.substring(11, 16).replaceAll(":", "");
                date = date.substring(4, 10) + date.substring(0, 4);
                console.log(date)
                console.log(time)

                fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '.JPG');
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}