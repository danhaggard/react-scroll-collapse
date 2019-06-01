import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import whyUpdate from '../src/utils/logging/index';

import Main from './components/Main';

require('./style/main.scss');

whyUpdate();

const store = configureStore();
render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
);
