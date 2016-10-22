import {createSelector} from 'reselect';

/* helper funcs used by all components */


export const isUndefNull = val => val === null || val === undefined;

// ensure state slice and attribute exist - else return null;
export const selector = (state, attr) => {
  if (isUndefNull(state)) {
    // return now to prevent access of state[attr]
    return null;
  }
  if (!isUndefNull(state[attr])) {
    return state[attr];
  }
  return null;
};

export const ifNotFirstSec = (firstVal, secondVal) =>
  (isUndefNull(firstVal) ? secondVal : firstVal);

export const arrSelector = (state, attr) => (state && state[attr] ? state[attr] : []);

export const selectFunc = getAttrFunc => innerSelectFunc => stateId => {
  const state = innerSelectFunc(stateId);
  return getAttrFunc(state);
};

/*
  Returns an array of ids (ints) which represent the all the nested children of
  the object represented by that id.

  State is normalised with each object only recording it's immediate Ccildren.
  So we recursively iterate through all children.

  selectorFunc should take redux state as an argument and should return another
  argument that takes an object id and returns an array representing the immediate
  children of that object.
*/

export const getAllNested = (id, selectorFunc) => {
  const concatChildren = (arr, i) => {
    /*
      ids of components are generated only as a component is mounting.  So on the
      first render selectorFunc will return null.  null.length will raise an
      error hence the check for !arr first.
    */
    const newArr = !arr ? [] : arr;
    if (i + 1 > newArr.length) {
      /* If true then we have iterated through all children */
      return newArr;
    }
    const nextChildren = selectorFunc(newArr[i]);
    /* recursive call is in tail call position. */
    return concatChildren([...newArr, ...nextChildren], i + 1);
  };
  return concatChildren(selectorFunc(id), 0);
};

/* common state selectors */
export const reactScrollCollapseSelector = (state) => selector(state, 'reactScrollCollapse');

export const entitiesSelector = createSelector(
  reactScrollCollapseSelector, reactScrollCollapse => selector(reactScrollCollapse, 'entities')
);
