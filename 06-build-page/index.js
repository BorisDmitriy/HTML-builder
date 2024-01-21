const fs = require('fs').promises;
const path = require('path');

const projectPath = path.join(__dirname, 'project-dist');
const componentsPath = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');
const stylePath = path.join(__dirname, 'styles');
const assetsPath = path.join(__dirname, 'assets');
const newAssetsPath = path.join(projectPath, 'assets');

async function createProjectFolder() {
  await fs.mkdir(projectPath, { recursive: true });
}
createProjectFolder();

async function createIndexFile() {
  let templateIndex = await fs.readFile(templatePath, 'utf8');

  const templateTagNames = templateIndex.match(/{{[^}]+}}/g);
  if (templateTagNames) {
    for (const tag of templateTagNames) {
      const tagName = tag.replace('{{', '').replace('}}', '');
      const componentContent = await fs.readFile(
        path.join(componentsPath, tagName + '.html'),
        'utf8',
      );

      while (templateIndex.includes(tag)) {
        templateIndex = templateIndex.replace(tag, componentContent);
      }
    }
    const indexPath = path.join(projectPath, 'index.html');
    await fs.writeFile(indexPath, templateIndex, 'utf8');
  }
}
createIndexFile();

async function bundleStyles() {
  const files = await fs.readdir(stylePath, { withFileTypes: true });

  const readFilesPromises = files
    .filter((file) => file.isFile() && path.extname(file.name) === '.css')
    .map((file) => fs.readFile(path.join(stylePath, file.name)));

  const fileContents = await Promise.all(readFilesPromises);

  const stylesContent = fileContents.join('\n');

  await fs.writeFile(path.join(projectPath, 'style.css'), stylesContent);
}
bundleStyles();

async function copyAssets(source, target) {
  const targetDirectory = path.resolve(target);
  await fs.mkdir(targetDirectory, { recursive: true });

  const files = await fs.readdir(source);
  for (const file of files) {
    const currentSource = path.join(source, file);
    const currentTarget = path.join(targetDirectory, file);
    const stats = await fs.stat(currentSource);

    if (stats.isDirectory()) {
      await copyAssets(currentSource, currentTarget);
    } else {
      await fs.copyFile(currentSource, currentTarget);
    }
  }
}

copyAssets(assetsPath, newAssetsPath);
