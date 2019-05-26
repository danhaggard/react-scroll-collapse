import { createStore, applyMiddleware, compose } from 'redux';

import reducers from '../reducers';


function reduxStore(initialState) {

  let enhancer;

  if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    enhancer = compose(
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // eslint-disable-line
    );
  } else {
    enhancer = compose();
  }

  const store = createStore(reducers, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers'); // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default reduxStore;
