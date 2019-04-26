/*
  ---------------------------getter helpers
*/
export const isUndefNull = val => val === null || val === undefined;

export const getOrDefault = (defaultValue = null) => (state, attr) => {
  if (isUndefNull(state)) {
    return defaultValue;
  }
  if (!isUndefNull(state[attr])) {
    return state[attr];
  }
  return defaultValue;
};

export const getOrArray = (state, attr) => getOrDefault([])(state, attr);
export const getOrNull = (state, attr) => getOrDefault()(state, attr);
export const getOrObject = (state, attr) => getOrDefault({})(state, attr, {});


/*
  -------------------------- Reducers
*/

// from https://medium.com/@dtipson/creating-an-es6ish-compose-in-javascript-ac580b95104a
export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));


/*
  curryCompose:

  Usefull when

  const func1 = theThingYouNeed => {returns: theThingYouWant }
  const func2 = theThingYouHave => theThingYouHaveLater => {returns: theThingYouNeed}

  curryCompose(func1, func2) will give you:
  theThingYouHave => theThingYouHaveLater => {returns: theThingYouWant }
*/
export const curryCompose = (f, h) => compose(g => (...args) => f(g(...args)), h);


export const everyReducer = condition => array => array.every(x => (x === condition));


/*
  Iterators:
*/
export const passArgsToIterator = iteratorMethod => (
  getIterable,
  callbackOuter,
  callbackInner
) => x => y => getIterable(x)(y)[iteratorMethod](
  z => callbackOuter(callbackInner(x)(z))
);

export const passArgsToIteratorEvery = passArgsToIterator('every');

export const forEachObjectKey = callback => object => Object.keys(object).forEach(
  key => callback(object[key])
);

export const everyObjectKey = callback => object => Object.keys(object).every(
  key => callback(object[key])
);

export const getNextIdFactory = (initialId = -1) => {
  let currentId = initialId;
  return () => {
    currentId += 1;
    return currentId;
  };
};
