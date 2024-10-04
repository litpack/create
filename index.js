#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Please provide a project name.');
  process.exit(1);
}

const validPackageManagers = ['npm', 'yarn', 'pnpm', 'bun'];

(async () => {
  const packageManager = await promptPackageManager();
  
  const isInquirerInstalled = await checkInquirerInstalled();
  if (!isInquirerInstalled) {
    console.log('inquirer is not installed. Installing it...');
    await installInquirer(packageManager);
  }

  const templateDir = path.join(__dirname, 'template');
  const targetDir = path.join(process.cwd(), projectName);

  try {
    await fs.mkdir(targetDir, { recursive: true });
    await copyTemplate(templateDir, targetDir);
    projectCreated(packageManager);
  } catch (err) {
    console.error(`Error creating project directory: ${err}`);
    process.exit(1);
  }
})();

async function promptPackageManager() {
  const inquirer = await import('inquirer');
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'packageManager',
      message: 'Please choose a package manager:',
      choices: validPackageManagers,
    },
  ]);
  return answers.packageManager;
}

async function checkInquirerInstalled() {
  try {
    require.resolve('inquirer');
    return true;
  } catch {
    return false;
  }
}

async function installInquirer(packageManager) {
  try {
    execSync(`${packageManager} install inquirer`, { stdio: 'inherit' });
    console.log('inquirer installed successfully.');
  } catch (err) {
    console.error(`Failed to install inquirer: ${err}`);
    process.exit(1);
  }
}

async function copyTemplate(src, dest) {
  const items = await fs.readdir(src);
  
  await Promise.all(items.map(async (item) => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);

    const stats = await fs.stat(srcPath);

    if (stats.isDirectory()) {
      await fs.mkdir(destPath, { recursive: true });
      await copyTemplate(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
      console.log(`Copied ${item} to ${destPath}`);
    }
  }));
}

function projectCreated(packageManager) {
  console.log(`Project ${projectName} created successfully!`);

  try {
    execSync(`${packageManager} --version`, { stdio: 'ignore' });
    console.log(`${packageManager} is already installed.`);
  } catch {
    console.log(`${packageManager} is not installed. Please install ${packageManager} to manage dependencies.`);
    console.log(`You can install ${packageManager} using the following command:`);
    if (packageManager === 'pnpm') {
      console.log('npm install -g pnpm');
    } else if (packageManager === 'yarn') {
      console.log('npm install -g yarn');
    } else if (packageManager === 'bun') {
      console.log('npm install -g bun');
    }
  }

  console.log(`\nTo get started, navigate into your project folder:`);
  console.log(`cd ${projectName}`);
  console.log(`Then, install the dependencies with:`);
  console.log(`${packageManager} install`);
}
