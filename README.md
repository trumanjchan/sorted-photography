# Sorted Photography
After coming back from a trip with many dslr photos, I started backing them up on Google Drive. Soon later I realized I should be uploading photos and videos to Google Photos, not Google Drive, as Photos would show each image already rendered on the screen in Instagram-style whereas Drive would require clicking each image to view in fullscreen. Migrating them over seemed to sometimes change the exif data, as images I was uploading to an album in Photos were placed out of order. I made this program to help rename and organize my assets, to be placed in Google Photos albums.

### Tested file extensions
- JPG/JPEG
- HEIC
- CR2
- MOV

### Requirements
- node v21.0.0
- run the program separately for batches of photos to-be-converted by the following conditions:
  - Don't care what timezone the pictures were taken in - Convert to Local Timezone
  - Photos taken in Local Timezone --CONVERT--> X Timezone
  - Photos taken in correct Timezone --CONVERT--> X Timezone

### Run locally
1. `npm install`
2. Move to-be-converted pics/vids to a "Photos" folder in root
3. `npm run sort`
4. Answer the two prompts in terminal (run program once)