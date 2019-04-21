import { createSelector } from 'reselect';
import { createGetterKey, createSelectorKey, createTypeInstanceSelectorKey } from '../utils/stringUtils';
import { getSelector } from './selectorCache';

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
  //console.log('getAllNested id', id);
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

export const recurseAllChildren = (
  id,
  state,
  props,
  selectorFunc,
  breakCondition // returns [bool (whether to break), and return value]
) => {
  // console.log('getAllNestedWithCondition ', id);
  const [shouldBreakRoot, returnValueRoot] = breakCondition(id);
  if (shouldBreakRoot) {
    return returnValueRoot;
  }
  const concatChildren = (arr, i, prevReturnValue) => {
    const [shouldBreak, returnValue] = breakCondition(arr[i], prevReturnValue);
    if (shouldBreak || arr.length === 0) {
      return prevReturnValue;
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
    return concatChildren([...newArr, ...nextChildren], i + 1, returnValue);
  };
  return concatChildren(selectorFunc(id), 0, returnValueRoot);
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
