const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.log(err);

  } 
  else {
    
    files.forEach((file) => {

      const filePath = path.join(folderPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(err);
        }

        if (stats.isFile()) {
          console.log(
            `${path.parse(file).name} - ${path.extname(file).slice(1)} - ${(stats.size / 1024).toFixed(2)} kb`,
          );
        }

      });
    });
  }
});
