const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'files');
const outputPath = path.join(__dirname, 'files-copy');

fs.readdir(inputPath, (err, files) => {
  if (err) {
    console.log(err);
  }

  let inputFiles = files;

  fs.mkdir(outputPath, { recursive: true }, (err) => {
    if (err) {
      console.log(err);
    }

    files.forEach((file) => {
      fs.copyFile(
        path.join(inputPath, file),
        path.join(outputPath, file),
        (err) => {
          if (err) {
            console.log(err);
          }
        },
      );
    });
  });

  fs.readdir(outputPath, (err, files) => {
    if (err) {
      console.log(err);
    }

    let outputFiles = files;

    outputFiles.forEach((outputFile, index) => {
      if (outputFile != inputFiles[index]) {
        fs.unlink(path.join(outputPath, outputFile), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
});
