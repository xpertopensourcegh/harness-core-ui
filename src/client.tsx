import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import 'styles/base.scss';

import App from './App';
import AppErrorBoundary from 'modules/common/components/AppErrorBoundary/AppErrorBoundary';

ReactDOM.render(
  <HashRouter>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </HashRouter>,
  document.getElementById('react-root')
);
