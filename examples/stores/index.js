import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import reducers from '../reducers';
import sagas from '../sagas';

function reduxStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const middleware = applyMiddleware(...[sagaMiddleware]);
  let enhancer;

  if (process.env.NODE_ENV !== 'production' && window.devToolsExtension) {
    enhancer = compose(
      middleware,
      window.devToolsExtension && window.devToolsExtension(),
    );
  } else {
    enhancer = compose(
      middleware,
    );
  }

  const store = createStore(reducers, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers'); // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  sagaMiddleware.run(sagas);
  return store;
}

export default reduxStore;
