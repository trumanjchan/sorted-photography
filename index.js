const fs = require('node:fs');
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);
var ExifImage = require('exif').ExifImage;

console.log("Start: " + files.length);

for (let i = 0; i < files.length; i++) {
    try {
        new ExifImage({ image : folderPath + files[i] }, function (error, exifData) {
            if (error)
                return;
            else
                var date = exifData.exif.DateTimeOriginal.substring(0, 10).replaceAll(":", "");
                var time = exifData.exif.DateTimeOriginal.substring(11, 16).replaceAll(":", "");
                date = date.substring(4, 10) + date.substring(0, 4);

                let originalName = files[i];
                originalName = originalName.replace(/\.jpe?g/i, "");

                fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '_' + originalName + '_' + exifData.image.Make + exifData.image.Model + '.jpg');
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}