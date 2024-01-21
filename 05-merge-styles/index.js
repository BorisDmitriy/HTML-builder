const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const stylesPath = path.join(__dirname, 'styles');
const projectPath = path.join(__dirname, 'project-dist');

async function bundleStyles() {
  const files = await readdir(stylesPath, { withFileTypes: true });

  const readFilesPromises = files
    .filter((file) => file.isFile() && path.extname(file.name) === '.css')
    .map((file) => readFile(path.join(stylesPath, file.name)));

  const fileContents = await Promise.all(readFilesPromises);

  const stylesContent = fileContents.join('\n');

  await writeFile(path.join(projectPath, 'bundle.css'), stylesContent);
}

bundleStyles();
