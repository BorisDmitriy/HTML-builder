const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = require('process');

const writeableStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  flags: 'a',
});

stdout.write('Greetings, enter your text:\n');

stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    stdout.write('The end, have a nice day.');
    exit();
  }

  writeableStream.write(`${data}`);
});

process.on('SIGINT', () => {
  stdout.write('The end, have a nice day.');
  exit();
});
