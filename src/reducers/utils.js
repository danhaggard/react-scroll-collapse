
// find the maximum of the array and add one to it.
// zero index.
export const getNextIdFromArr = arr => (arr.length < 1 ? 0 : Math.max(...arr) + 1);

export const getNextIdFromObj = (obj) => {
  const keys = Object.keys(obj);
  return getNextIdFromArr(keys);
};

export const addToState = (state, action, id, reducer) => {
  const newState = { ...state };
  newState[id] = reducer(state[id], action);
  return newState;
};

export const updateState = (state, action, id, reducer) => {
  const newState = { ...state };
  if (id in newState) {
    newState[id] = reducer(state[id], action);
  }
  return newState;
};

export const updateStateArray = (state, action, idArray, reducer) => {
  const newState = { ...state };
  idArray.forEach((id) => {
    if (id in newState) {
      newState[id] = reducer(state[id], action);
    }
  });
  return newState;
};

export const updateObjectArray = (objectArray, newObject) => [
  ...objectArray.filter(obj => obj.id !== newObject.id),
  newObject
];

export const removeFromState = (state, id) => {
  const newState = { ...state };
  delete newState[id];
  return newState;
};

export const injectPayload = (action, obj) => ({
  ...action,
  payload: {
    ...action.payload,
    ...obj
  }
});
