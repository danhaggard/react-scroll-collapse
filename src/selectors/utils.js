import { createSelector } from 'reselect';
import { createGetterKey, createSelectorKey, createTypeInstanceSelectorKey } from '../utils/stringUtils';
import { getSelector } from './selectorCache';
import simpleCache from './simpleCache';

/* helper funcs used by all components */

export const isUndefNull = val => val === null || val === undefined;

// ensure state slice and attribute exist - else return null;
export const selectOrVal = (state, attr, defaultValue = null) => {
  if (isUndefNull(state)) {
    // return now to prevent access of state[attr]
    return defaultValue;
  }
  if (!isUndefNull(state[attr])) {
    return state[attr];
  }
  return defaultValue;
};

export const getNextIdFactory = (initialId = -1) => {
  let currentId = initialId;
  return () => {
    currentId += 1;
    return currentId;
  };
};

export const ifNotFirstSec = (
  firstVal,
  secondVal
) => (isUndefNull(firstVal) ? secondVal : firstVal);

export const arrSelector = (state, attr) => (state && state[attr] ? state[attr] : []);

export const selectFunc = getAttrFunc => innerSelectFunc => (stateId) => {
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
  // console.log('getAllNested id', id);
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

export const getAllNestedTest = selectorFunc => (id) => {
  //console.log('getAllNestedTest ', id);
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

let recurseCount = -1;

export const recurseAllChildren = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {

  //console.log('concatTotal - id, concatTotal:', id, concatTotal);
  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);

/*
  if (id === 0) {
    console.log('shouldBreakRoot, returnValueRoot', shouldBreakRoot, returnValueRoot);
  }
*/
  if (shouldBreakRoot) {
    return returnValueRoot;
  }

  const concatChildren = (arr, i, prevReturnValue) => {


    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);
/*
    if (id === 0) {
      console.log('shouldBreak, arr.length === 0, prevReturnValue, returnValue', shouldBreak, arr.length === 0, prevReturnValue, returnValue);
    }
*/
    if (shouldBreak || arr.length === 0) {
      return returnValue;
    }
    /*
      ids of components are generated only as a component is mounting.  So on the
      first render selectorFunc will return null.  null.length will raise an
      error hence the check for !arr first.
    */
    const newArr = !arr ? [] : arr;
/*
    if (id === 0) {
      console.log('i + 1 > newArr.length', i + 1 > newArr.length);
    }
*/
    if (i + 1 > newArr.length) {

      /* If true then we have iterated through all children */
      return prevReturnValue;
    }
    const nextChildren = selectorFunc(newArr[i]);
    /* recursive call is in tail call position. */

    return concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
  };


  const returnVal = concatChildren(selectorFunc(id), 0, returnValueRoot);

  return returnVal;


  // return concatChildren(selectorFunc(id), 0, returnValueRoot);
};


export const recurseAllChildrenLog = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {
  recurseCount += 1
  let concatTotal = -1;
  console.log('recurseAllChildren - id, recurseCount:', id, recurseCount);
  //console.log('concatTotal - id, concatTotal:', id, concatTotal);
  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);


  if (id === 0) {
    console.log('shouldBreakRoot, returnValueRoot', shouldBreakRoot, returnValueRoot);
  }

  if (shouldBreakRoot) {
    return returnValueRoot;
  }

  const concatChildren = (arr, i, prevReturnValue) => {
    concatTotal += 1;
    console.log('id, , recurseCount, arr[i], concatTotal:', id, recurseCount, arr[i], concatTotal);

    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);
/*
    if (id === 0) {
      console.log('shouldBreak, arr.length === 0, prevReturnValue, returnValue', shouldBreak, arr.length === 0, prevReturnValue, returnValue);
    }
*/
    if (shouldBreak || arr.length === 0) {
      console.log('break for: (shouldBreak || arr.length === 0) ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);
      return returnValue;
    }
    /*
      ids of components are generated only as a component is mounting.  So on the
      first render selectorFunc will return null.  null.length will raise an
      error hence the check for !arr first.
    */
    const newArr = !arr ? [] : arr;
/*
    if (id === 0) {
      console.log('i + 1 > newArr.length', i + 1 > newArr.length);
    }
*/
    if (i + 1 > newArr.length) {
      console.log('break for: (i + 1 > newArr.length) ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);

      /* If true then we have iterated through all children */
      return prevReturnValue;
    }
    const nextChildren = selectorFunc(newArr[i]);
    /* recursive call is in tail call position. */
    console.log('Recursing into id: ', [...newArr, ...nextChildren][i + 1], ' ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);

    return concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
  };


  const returnVal = concatChildren(selectorFunc(id), 0, returnValueRoot);
  console.log('');

  return returnVal;


  // return concatChildren(selectorFunc(id), 0, returnValueRoot);
};


export const recurseAllChildrenLog2 = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {
  recurseCount += 1
  let concatTotal = -1;
  console.log('recurseAllChildren - id, recurseCount:', id, recurseCount);

  let cachedResult = simpleCache.getResult(id);
  if (cachedResult !== undefined) {
    console.log('recurseAllChildren - returning root cachedResult -  id, arr[i], cachedResult:', id, cachedResult);
    return cachedResult;
  }

  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);

/*
  if (id === 0) {
    console.log('shouldBreakRoot, returnValueRoot', shouldBreakRoot, returnValueRoot);
  }
*/
  if (shouldBreakRoot) {
    console.log('recurseAllChildren - shouldBreakRoot - id, recurseCount:', id, recurseCount);
    simpleCache.addResult(id, returnValueRoot);
    return returnValueRoot;
  }

  const concatChildren = (arr, i, prevReturnValue) => {
    concatTotal += 1;
    console.log('id, , recurseCount, arr[i], concatTotal:', id, recurseCount, arr[i], concatTotal);

    cachedResult = simpleCache.getResult(arr[i]);
    if (cachedResult !== undefined) {
      console.log('concatChildren - returning cachedResult -  id, arr[i], cachedResult:', id, arr[i], cachedResult);
      return cachedResult;
    }

    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);
/*
    if (id === 0) {
      console.log('shouldBreak, arr.length === 0, prevReturnValue, returnValue', shouldBreak, arr.length === 0, prevReturnValue, returnValue);
    }
*/
    if (shouldBreak || arr.length === 0) {
      //simpleCache.addResult(arr[i], returnValue);
      console.log('break for: (shouldBreak || arr.length === 0) ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);
      return returnValue;
    }
    /*
      ids of components are generated only as a component is mounting.  So on the
      first render selectorFunc will return null.  null.length will raise an
      error hence the check for !arr first.
    */
    const newArr = !arr ? [] : arr;
/*
    if (id === 0) {
      console.log('i + 1 > newArr.length', i + 1 > newArr.length);
    }
*/
    if (i + 1 > newArr.length) {
      console.log('break for: (i + 1 > newArr.length) ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);

      /* If true then we have iterated through all children */
      //simpleCache.addResult(arr[i], prevReturnValue);
      return prevReturnValue;
    }
    const nextChildren = selectorFunc(newArr[i]);
    /* recursive call is in tail call position. */
    const nextArray = [...newArr, ...nextChildren];

    /*
    cachedResult = simpleCache.getResult(nextArray[i + 1]);
    if (cachedResult !== undefined) {
      console.log('concatChildren - returning cachedResult instead of recursing -  id, arr[i], cachedResult:', id, arr[i], cachedResult);
      return cachedResult;
    }
    */
    console.log('Next Children for newArr[i] ', newArr[i], nextChildren);

    console.log('Recursing into id: ', nextArray[i + 1], ' ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);
    const nextValue = concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
    simpleCache.addResult(arr[i + 1], nextValue);
    return nextValue;
  };


  const returnVal = concatChildren(selectorFunc(id), 0, returnValueRoot);
  console.log('');
  simpleCache.addResult(id, returnVal);
  return returnVal;


  // return concatChildren(selectorFunc(id), 0, returnValueRoot);
};




export const recurseAllChildrenLog3 = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {
  recurseCount += 1
  let concatTotal = -1;
  console.log('recurseAllChildren - id, recurseCount:', id, recurseCount);

  let cachedResult = simpleCache.getResult(id);
  if (cachedResult !== undefined) {
    console.log('recurseAllChildren - returning root cachedResult -  id, arr[i], cachedResult:', id, cachedResult);
    return cachedResult;
  }

  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);

/*
  if (id === 0) {
    console.log('shouldBreakRoot, returnValueRoot', shouldBreakRoot, returnValueRoot);
  }
*/
  if (shouldBreakRoot) {
    console.log('recurseAllChildren - shouldBreakRoot - id, recurseCount:', id, recurseCount);
    simpleCache.addResult(id, returnValueRoot);
    return returnValueRoot;
  }

  const concatChildren = (arr, i, prevReturnValue) => {
    concatTotal += 1;
    console.log('id, , recurseCount, arr[i], concatTotal:', id, recurseCount, arr[i], concatTotal);

    cachedResult = simpleCache.getResult(arr[i]);
    if (cachedResult !== undefined) {
      console.log('concatChildren - returning cachedResult -  id, arr[i], cachedResult:', id, arr[i], cachedResult);
      return cachedResult;
    }

    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);
/*
    if (id === 0) {
      console.log('shouldBreak, arr.length === 0, prevReturnValue, returnValue', shouldBreak, arr.length === 0, prevReturnValue, returnValue);
    }
*/
    if (shouldBreak || arr.length === 0) {
      //simpleCache.addResult(arr[i], returnValue);
      console.log('break for: (shouldBreak || arr.length === 0) ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);
      return returnValue;
    }
    /*
      ids of components are generated only as a component is mounting.  So on the
      first render selectorFunc will return null.  null.length will raise an
      error hence the check for !arr first.
    */
    const newArr = !arr ? [] : arr;
/*
    if (id === 0) {
      console.log('i + 1 > newArr.length', i + 1 > newArr.length);
    }
*/
    if (i + 1 > newArr.length) {
      console.log('break for: (i + 1 > newArr.length) ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);

      /* If true then we have iterated through all children */
      //simpleCache.addResult(arr[i], prevReturnValue);
      return prevReturnValue;
    }
    const nextChildren = selectorFunc(newArr[i]);
    /* recursive call is in tail call position. */
    const nextArray = [...newArr, ...nextChildren];

    /*
    cachedResult = simpleCache.getResult(nextArray[i + 1]);
    if (cachedResult !== undefined) {
      console.log('concatChildren - returning cachedResult instead of recursing -  id, arr[i], cachedResult:', id, arr[i], cachedResult);
      return cachedResult;
    }
    */

    console.log('Recursing into id: ', nextArray[i + 1], ' ---- id, recurseCount, arr[i], concatTotal', id, recurseCount, arr[i], concatTotal);
    const nextValue = concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
    simpleCache.addResult(arr[i + 1], nextValue);
    return nextValue;
  };


  const returnVal = concatChildren(selectorFunc(id), 0, returnValueRoot);
  console.log('');
  simpleCache.addResult(id, returnVal);
  return returnVal;


  // return concatChildren(selectorFunc(id), 0, returnValueRoot);
};




export const recurseAllChildrenCached = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {

  let cachedResult = simpleCache.getResult(id);
  if (cachedResult !== undefined) {
    return cachedResult;
  }

  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);

  if (shouldBreakRoot) {
    simpleCache.addResult(id, returnValueRoot);
    return returnValueRoot;
  }

  const concatChildren = (arr, i, prevReturnValue) => {

    cachedResult = simpleCache.getResult(arr[i]);
    if (cachedResult !== undefined) {
      return cachedResult;
    }

    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);

    if (shouldBreak || arr.length === 0) {
      return returnValue;
    }
    /*
      ids of components are generated only as a component is mounting.  So on the
      first render selectorFunc will return null.  null.length will raise an
      error hence the check for !arr first.
    */
    const newArr = !arr ? [] : arr;

    if (i + 1 > newArr.length) {
      /* If true then we have iterated through all children */
      return prevReturnValue;
    }

    const nextChildren = selectorFunc(newArr[i]);

    /* recursive call is in tail call position. */
    const nextValue = concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
    simpleCache.addResult(arr[i + 1], nextValue);
    return nextValue;
  };

  const returnVal = concatChildren(selectorFunc(id), 0, returnValueRoot);
  simpleCache.addResult(id, returnVal);

  return returnVal;
};



/*
  createTypeInstanceAttributeSelector:
    returns (func):  rootState -> id => typeInstance[attribute]
    args:
      attributeGetter: (func) -: typeInstance => typeInstance[attribute]
      typeInstanceSelector: (func) -: rootState -> id => typeInstance
*/
export const createTypeInstanceAttributeSelector = (
  attributeGetter,
  typeInstanceSelector
) => () => createSelector(
  typeInstanceSelector(), selectorFunc => id => attributeGetter(selectorFunc(id))
);

// arg: array of attr keys.  Returns an object of getters each takes the obj
// and returns the val.
const createTypeKeyGetters = (
  typeAttributes,
  selector = selectOrVal
) => [...typeAttributes, 'id'].reduce((obj, key) => ({
  ...obj,
  [createGetterKey(key)]: typeInstance => selector(typeInstance, key)
}), {});


const createTypeKeySelectors = (typeAttributes, typeInstanceSelector, selector = selectOrVal) => {
  const attributeGetters = createTypeKeyGetters(typeAttributes, selector);
  const selectors = [...typeAttributes, 'id'].reduce((obj, key) => ({
    ...obj,
    [createSelectorKey(key)]: createTypeInstanceAttributeSelector(
      attributeGetters[createGetterKey(key)], typeInstanceSelector
    )
  }), {});
  return {
    getters: attributeGetters,
    selectors,
  };
};

/*
  Your state looks thus:

  state => yourAppKey => entities => ({

    entityTypeA: {
      0: {
        key1: val,
        ..etc,
      },
      1: {
        key1: val,
        ..etc,
      },
      ...etc,
    },
    entityTypeB: {
      0: {
        key1: val,
        ..etc,
      },
      1: {
        key1: val,
        ..etc,
      },
      ...etc,
    },
  })

  createEntityTypeSelectors:
    args:
      typeKey: (str) - e.g. 'entityTypeA'
      entitiesSelector: (func): takes your root state object and returns the
        entities state slice. e.g: state => state.yourAppKey.entities;
      typeAttributes: array of strings that describe your entity type.  e.g:
        ['key1', 'key2', etc...] (don't include the 'id' key it is added for you)

    returns (obj) {
      getters: {  (non-memoized)
        getKey1: (func) :- entityInstance -> entityInstance[key1],
        ...
      },
      selectors: {  (memoized)
        key1Selector: (func) :- () -> state -> id -> entitys.entityTypeA.id.key1
      }
    }

    selectors are useful for mapStateToProps:

    const mapStateToProps = (state, ownProps) => ({
      key1: key1Selector()(state)(ownProps.itemId),
    });
*/


const createTypeEntitiesSelector = (
  entitiesSelector,
  typeGetter
) => () => createSelector(entitiesSelector(), typeGetter);

const createTypeInstanceSelector = (
  typeEntitiesSelector,
  selectTypeInstanceFunc
) => () => createSelector(typeEntitiesSelector(), selectTypeInstanceFunc);


export const createEntityTypeSelectors = (
  typeKey,
  entitiesSelector,
  typeAttributes,
  selector = selectOrVal
) => {
  const typeGetter = entities => selector(entities, typeKey);
  const typeEntitiesSelector = createTypeEntitiesSelector(entitiesSelector, typeGetter);
  const selectTypeInstanceFunc = instance => id => selector(instance, id);

  /* creates new selector every time when called - so can correctly memoize */
  const typeInstanceSelector = createTypeInstanceSelector(
    typeEntitiesSelector, selectTypeInstanceFunc
  );

  const typeSelectors = createTypeKeySelectors(typeAttributes, typeInstanceSelector, selector);
  typeSelectors[createTypeInstanceSelectorKey(typeKey)] = typeInstanceSelector;
  return typeSelectors;
};

/*
  createAllNestedOfTypeSelector:

  returns an array of ids of the same type that are descendents.

  args:
    typeInstanceAttributeSelector - i.e. returned from: createTypeInstanceAttributeSelector
      rootState -> id => entities.type[id][attribute]
      In this case it should select an array of ids - which are used to select
      others entities of the same type.
    recurseFunc: (id, selectorFunc) => [array of all the child ids]
*/
export const createAllNestedOfTypeSelector = (
  typeInstanceAttributeSelector,
  recurseFunc,
) => () => createSelector(
  typeInstanceAttributeSelector(),
  typeSelectorArg => id => recurseFunc(id, typeSelectorArg)
);

export const mapIdArr = (
  idArr, idSelectFunc,
  state = null, //eslint-disable-line
  dependentSelect = null //eslint-disable-line
) => idArr.map(idSelectFunc);

export const dependentGetterFactory = (mappingFunc = mapIdArr) => (
  primarySelect,
  dependentSelect
) => (state) => {
  const allDependentIds = primarySelect(state);
  return mappingFunc(
    allDependentIds,
    dependentId => dependentSelect(dependentId),
    state,
    dependentSelect
  );
};


export const concatDependents = (
  idArr,
  func,
  state,
  select
) => select(state).concat(...mapIdArr(idArr, func));

/*
  e.g an instance of type 'primary' has an attribute called: 'primarys'.
  Which is an array of ints representing other primary instances under the 'primary'
  key in entities.

  Each of these instances has an attribute called 'dependents' - which is another
  array of ints.  We want to concat these together

  args:
    allNestedPrimarySelectorArg: state -> primaryId -> [...all nest primary ids]
    dependentTypeAttributeSelectorArg: state -> primaryId -> primaryInstance[dependentTypeAttr]
*/

export const createAllNestedDependentSelector = (
  allPrimarySelector,
  dependentSelector
) => dependentGetter => () => createSelector(
  [allPrimarySelector(), dependentSelector()],
  dependentGetter
);

export const createAttrSelector = (
  bool,
  all = false
) => typeAttrArraySelector => () => createSelector(
  typeAttrArraySelector(),
  typeAttrArray => (id) => {
    const result = typeAttrArray(id).some(attr => attr === bool);
    return all ? !result : result;
  }
);

export const createAllSelector = createAttrSelector(false, true);
export const createSomeSelector = createAttrSelector(true);
export const createNoneSelector = createAttrSelector(true, true);

/* common state selectors */
export const reactScrollCollapseSelector = state => selectOrVal(state, 'reactScrollCollapse');

export const entitiesSelector = () => createSelector(
  reactScrollCollapseSelector, reactScrollCollapse => selectOrVal(reactScrollCollapse, 'entities')
);




/*
export const recurseAllChildren = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {
  //console.log('recurseAllChildren -id:', id);
  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);

  if (id === 0) {
    console.log('shouldBreakRoot, returnValueRoot', shouldBreakRoot, returnValueRoot);
  }

  if (shouldBreakRoot) {
    return returnValueRoot;
  }
  const concatChildren = (arr, i, prevReturnValue) => {
    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);

    if (id === 0) {
      console.log('shouldBreak, prevReturnValue, returnValue', shouldBreak, prevReturnValue, returnValue);
    }

    if (shouldBreak || arr.length === 0) {
      return prevReturnValue;
    }

    const newArr = !arr ? [] : arr;
    if (i + 1 > newArr.length) {
      return prevReturnValue;
    }
    const nextChildren = selectorFunc(newArr[i]);
    return concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
  };
  const returnVal = concatChildren(selectorFunc(id), 0, returnValueRoot);
  console.log('collapserId returnVal in concatChildren', id, returnVal);
  return returnVal;
  // return concatChildren(selectorFunc(id), 0, returnValueRoot);
};


*/

export const getAllNestedlll = (id, selectorFunc) => {
  const concatChildren = (arr, i) => {
    const newArr = !arr ? [] : arr;
    if (i + 1 > newArr.length) {
      return newArr;
    }
    const nextChildren = selectorFunc(newArr[i]);
    return concatChildren([...newArr, ...nextChildren], i + 1);
  };

  return concatChildren(selectorFunc(id), 0);
};


const arrayMax = (arr) => {
  let len = arr.length;
  let max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
};

export const recurseToNode = (argsObj) => {

  const {
    cache,
    childSelectorFunc,
    currentNodeId,
    evaluationFunc, // e.g. [true, [true, false]] - resolves to true or false?
    selectorFunc,
    targetNodeId,
    reachedTargetNode,
  } = argsObj;

  const cachedValue = cache.getResult(currentNodeId);

  if (cachedValue !== null && cache.isCacheLocked()) {
    return cachedValue;
  }

  const result = selectorFunc(currentNodeId);

  const childArray = childSelectorFunc(currentNodeId);
  if (childArray.length === 0) {
    return cache.addResult(currentNodeId, result);
  }

  const reachedTargetNodeCheck = reachedTargetNode || currentNodeId === targetNodeId;

  /*
    Want to avoid entering here if we are below target on the wrong branch.

    but cache will catch em first anyway?

    NO - collapser above the target calls with itself as target and origin so -
    reaches targetNode.
  */
  if (reachedTargetNodeCheck || targetNodeId < 0) {
    /*
      We are either below the targetNode - or on a branch that doesn't care.
      How deal? - cache will have a locking mechanism.

      When locked it will return the cached value.  When unlocked - any cached
      value asked for will be turfed WHEN it is asked for it.

      So on first render collapserId 0 will unlock the cache - and then lock
      again after the first pass.

      So since we mnade it past teh cache here - we assume we are below the
      target node.
    */
    const val = evaluationFunc([result, ...childArray.map(nextNodeId => recurseToNode({
      ...argsObj,
      currentNodeId: nextNodeId,
      reachedTargetNode: reachedTargetNodeCheck,
    }))]);
    return cache.addResult(
      currentNodeId,
      val
    );
  }

  const nextNodeId = arrayMax([...childArray.filter(id => (id <= targetNodeId))]);
  const val = evaluationFunc([result, recurseToNode({
    ...argsObj,
    currentNodeId: nextNodeId
  })]);
  if (currentNodeId >= targetNodeId) {
    debugger;
  }
  return cache.addResult(
    currentNodeId,
    val
  );

};
