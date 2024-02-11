/*
 * MIT License
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import './polyfills';
import App from './App';
import config from './config';
import './index.css';
// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(
  <Router basename={config.app.basename}>
    <App />
  </Router>,
  document.getElementById('root'),
);
