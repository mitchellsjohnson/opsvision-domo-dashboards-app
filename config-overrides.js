/* global __dirname */
/* eslint-disable import/no-extraneous-dependencies */

// Support storing environment variables 
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Read environment variables from appropriate environment file. Override environment vars if they are already set.

const TARGET_ENV = process.env.TARGET_ENV || 'local';
const ENV_FILE = path.resolve(__dirname, './environment', `${TARGET_ENV}.env`);

// const TESTENV = path.resolve(__dirname, '..', 'testenv');
if (fs.existsSync(ENV_FILE)) {
  const envConfig = dotenv.parse(fs.readFileSync(ENV_FILE));
  Object.keys(envConfig).forEach((k) => {
    process.env[k] = envConfig[k];
  });
}
process.env.OKTA_CLIENT_ID = process.env.OKTA_CLIENT_ID || process.env.OKTA_SPA_CLIENT_ID;
process.env.OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
process.env.USE_INTERACTION_CODE = process.env.USE_INTERACTION_CODE || false;

const webpack = require('webpack');

const env = {};

// List of environment variables made available to the app
[
  'OKTA_ISSUER',
  'OKTA_CLIENT_ID',
  'OKTA_TESTING_DISABLEHTTPSCHECK',
  'USE_INTERACTION_CODE'
].forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Environment variable ${key} must be set. See README.md`);
  }
  env[key] = JSON.stringify(process.env[key]);
});

module.exports = {
  /* eslint-disable no-param-reassign */
  webpack: (config) => {
    // Remove the 'ModuleScopePlugin' which keeps us from requiring outside the src/ dir
    config.resolve.plugins = [];

    // Define global vars from env vars (process.env has already been defined)
    config.plugins = config.plugins.concat([
      new webpack.DefinePlugin({
        'process.env': env,
      }),
    ]);

    config.devtool = 'source-map';
    config.module.rules.push({
      test: /\.js$/,
      use: ['source-map-loader'],
      enforce: 'pre',
    });

    return config;
  },
};
