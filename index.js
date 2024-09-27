const fs = require('node:fs');
const folderPath = './Photos/';
const files = fs.readdirSync(folderPath);

var ExifImage = require('exif').ExifImage;
var ffprobe = require('ffprobe'), ffprobeStatic = require('ffprobe-static'), moment = require('moment-timezone');

console.log(files.length);

for (let i = 0; i < files.length; i++) {
    try {
        // Change image file names
        new ExifImage({ image : folderPath + files[i] }, function (error, exifData) {
            if (error)
                return;
            else
                var date = exifData.exif.DateTimeOriginal.substring(0, 10).replaceAll(":", "");
                var time = exifData.exif.DateTimeOriginal.substring(11, 16).replaceAll(":", "");
                date = date.substring(4, 10) + date.substring(0, 4);

                let originalName = files[i];
                let extensionName = originalName.slice(originalName.lastIndexOf('.'));
                originalName = originalName.replace(/\.jpe?g/i, "");

                console.log(date + '_' + time + '_' + originalName + '_' + exifData.image.Make + exifData.image.Model + extensionName)
                fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '_' + originalName + '_' + exifData.image.Make + exifData.image.Model + extensionName);
        });
        
        // Change video file names
        ffprobe(folderPath + files[i], { path: ffprobeStatic.path }, function (err, info) {
            if (err) return err;

            var videoData = moment(info.streams[1].tags.creation_time.substring(0, 19) + info.streams[1].tags.creation_time.at(-1));
            videoData.tz('America/Los_Angeles').format('ha z');

            var date = videoData.format().substring(0, 10).replaceAll("-", "");
            date = date.substring(4, 10) + date.substring(0, 4);

            var time = videoData.format().substring(11, 16).replaceAll(":", "");

            let originalName = files[i];
            let extensionName = originalName.slice(originalName.lastIndexOf('.'));
            originalName = originalName.replace(/\.mov$/i, "");

            console.log(date + '_' + time + '_' + originalName + extensionName);
            fs.renameSync(folderPath + files[i], folderPath + date + '_' + time + '_' + originalName + extensionName);
        });
    } catch (error) {
        console.log('Error: ' + error.message);
    }
}