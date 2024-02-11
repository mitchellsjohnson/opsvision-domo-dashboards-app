/*
 * MIT License
 */
/* eslint-disable */
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

// Load environment variables
require('./env');

var E2E_DIR = './okta-oidc-tck/e2e-tests/custom-login/';
var config = require(E2E_DIR + 'conf.js').config;
config.specs = config.specs.map(function (path) {
  return E2E_DIR + path;
});

['OKTA_CLIENT_ID', 'OKTA_ISSUER', 'OKTA_TEST_USERNAME', 'OKTA_TEST_PASSWORD'].forEach(function(key) {
  if (!process.env[key]) {
    throw new Error('Environment variable "' + key + '" is not set');
  }
});

exports.config = config;