/*
 * MIT License
 */

/* eslint-disable no-console */

'use strict';

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function cloneRepository(repository, directory, branch) {
  const dir = path.join(__dirname, '..', directory);
  if (fs.existsSync(dir)) {
    console.log(`${directory} is already cloned.`);
    return;
  }

  let command = `git clone ${repository}`;
  if (branch) {
    command = `git clone --single-branch --branch ${branch} ${repository}`;
  }
  console.log(`Cloning repository ${directory}`);
  execSync(command);
}

cloneRepository('https://github.com/okta/samples-nodejs-express-4.git', 'samples-nodejs-express-4');
execSync(`cd ${path.join(__dirname, '..', 'samples-nodejs-express-4')} && npm install --unsafe-perm`);

cloneRepository('https://github.com/okta/okta-oidc-tck.git', 'okta-oidc-tck', 'master');
