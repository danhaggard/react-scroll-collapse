import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
// import whyUpdate from '../src/utils/logging';
// import App from './components/App';
// import App from './containers/testing/SingleCollapser';
// import App from './containers/testing/SingleCollapserScroller';
//
// import App from './containers/testing/SingleNestedCollapserScroller';
import App from './containers/testing/TwoExampleTest';

require('./style/main.scss');

// whyUpdate();

const store = configureStore();
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
