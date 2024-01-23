const path = require('path');
const fs = require('fs').promises;

const inputPath = path.join(__dirname, 'files');
const outputPath = path.join(__dirname, 'files-copy');

async function removeAndCopyFiles(source, target) {
  const targetDirectory = path.resolve(target);

  await fs.mkdir(targetDirectory, { recursive: true });

  const removingFiles = await fs.readdir(target);
  for (const file of removingFiles) {
    await fs.unlink(path.join(target, file));
  }

  const files = await fs.readdir(source);

  for (const file of files) {
    const currentSource = path.join(source, file);
    const currentTarget = path.join(targetDirectory, file);
    const stats = await fs.stat(currentSource);

    if (stats.isDirectory()) {
      await removeAndCopyFiles(currentSource, currentTarget);
    } else {
      await fs.copyFile(currentSource, currentTarget);
    }
  }
}

removeAndCopyFiles(inputPath, outputPath);
