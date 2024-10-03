#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('Please provide a project name.');
  process.exit(1);
}

const templateDir = path.join(__dirname, 'template');
const targetDir = path.join(process.cwd(), projectName);

fs.mkdir(targetDir, { recursive: true }, (err) => {
  if (err) {
    console.error(`Error creating project directory: ${err}`);
    process.exit(1);
  }

  copyTemplate(templateDir, targetDir);
});

function copyTemplate(src, dest) {
  fs.readdir(src, (err, items) => {
    if (err) {
      console.error(`Error reading template directory: ${err}`);
      process.exit(1);
    }

    let copyCount = items.length;

    items.forEach((item) => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);

      fs.stat(srcPath, (err, stats) => {
        if (err) {
          console.error(`Error getting stats for ${srcPath}: ${err}`);
          process.exit(1);
        }

        if (stats.isDirectory()) {
          fs.mkdir(destPath, { recursive: true }, (err) => {
            if (err) {
              console.error(`Error creating directory ${destPath}: ${err}`);
              process.exit(1);
            }
            copyTemplate(srcPath, destPath);
            copyCount -= 1;
            if (copyCount === 0) {
              projectCreated();
            }
          });
        } else {
          fs.copyFile(srcPath, destPath, (err) => {
            if (err) {
              console.error(`Error copying file ${item}: ${err}`);
            } else {
              console.log(`Copied ${item} to ${dest}`);
            }
            copyCount -= 1;
            if (copyCount === 0) {
              projectCreated();
            }
          });
        }
      });
    });
  });
}

function projectCreated() {
  console.log(`Project ${projectName} created successfully!`);

  try {
    execSync('pnpm --version', { stdio: 'ignore' });
    console.log('pnpm is already installed.');
  } catch {
    console.log('pnpm is not installed. Please install pnpm to manage dependencies.');
    console.log('You can install pnpm with the following command:');
    console.log('npm install -g pnpm');
  }

  console.log(`\nTo get started, navigate into your project folder:`);
  console.log(`cd ${projectName}`);
  console.log(`Then, install the dependencies with:`);
  console.log(`pnpm install`);
}
