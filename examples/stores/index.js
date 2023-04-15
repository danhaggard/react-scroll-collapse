import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducers from '../reducers';

const middleware = applyMiddleware(thunk);

function reduxStore(initialState) {

  let enhancer;

  if (process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancer = compose(
      middleware,
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(), // eslint-disable-line
    );
  } else {
    enhancer = compose(middleware);
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
