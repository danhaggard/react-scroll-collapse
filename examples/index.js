import React from 'react';
import Dom, { render } from 'react-dom';
console.log('dom', Dom);
import { Provider } from 'react-redux';
import configureStore from './stores';
// import whyUpdate from '../src/utils/logging/index';

import Main from './components/Main';

require('./style/main.scss');

// whyUpdate();

const store = configureStore();
render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);
