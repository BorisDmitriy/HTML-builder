const fs = require('fs');
const path = require('path');

const fileStream = fs.createReadStream(path.join(__dirname, 'text.txt'));

fileStream.on('data', function (fSteam) {
  console.log(fSteam.toString());
});
