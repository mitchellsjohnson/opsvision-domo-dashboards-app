// Read environment variables from "testenv" in the repository root. Override environment vars if they are already set.
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

const TARGET_ENV = process.env.TARGET_ENV || 'local';
console.log('Target Env:  ' + TARGET_ENV);
const ENV_FILE = path.resolve(__dirname, './environment', `${TARGET_ENV}.env`);
console.log('ENV_FILE:  ' + ENV_FILE);
if (fs.existsSync(ENV_FILE)) {
  console.log('FOUND ENV FILE ');
  const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE));
  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
}
process.env.OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID || process.env.OKTA_SPA_CLIENT_ID;

