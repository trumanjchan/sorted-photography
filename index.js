const fs = require('node:fs');
const folderPath = './oldPhotos';
const files = fs.readdirSync(folderPath);
var ExifImage = require('exif').ExifImage;

console.log(files.length);

for (let i = 0; i < files.length; i++) {
    try {
        new ExifImage({ image : folderPath + '/' + files[i] }, function (error, exifData) {
            if (error)
                console.log('Error: ' + error.message);
            else
                console.log(exifData.exif.DateTimeOriginal);
                if (!fs.existsSync('newPhotos')) {
                    fs.mkdirSync('newPhotos');
                }
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}