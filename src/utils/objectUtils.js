import { getNextIdFactory } from './selectorUtils';

export const filterObject = (
  objToFilter,
  objToFilterBy = {},
  arrayToFilterBy = []
) => { //eslint-disable-line
  const newObj = {};
  const totalKeys = [...Object.keys(objToFilterBy), ...arrayToFilterBy];
  Object.entries(objToFilter).forEach(([key, value]) => {
    if (!totalKeys.includes(key)) {
      newObj[key] = value;
    }
  });
  return newObj;
};

export const addPropertiesToObject = (objA, objB) => Object.entries(objB).forEach(([key, value]) => (objA[key] = value));  // eslint-disable-line

export const setContextAttrs = (that) => {
  const {
    props: {
      _reactScrollCollapse: {
        id, isRootNode, parents,
        methods,
        rootNodeId,
        rootNodes,
        type,
      }
    }
  } = that;
  const parentCollapserId = parents ? parents.collapser : undefined;
  const parentScrollerId = parents ? parents.scroller : undefined;
  addPropertiesToObject(that, {
    id,
    isRootNode,
    methods,
    parentCollapserId,
    parentScrollerId,
    rootNodeId,
    rootNodes,
    type,
  });
};

export const createSubscriberRegistry = () => {
  const counter = getNextIdFactory();

  const registry = {};

  const add = (val) => {
    const id = counter();
    registry[id] = val;
    return id;
  };

  const remove = id => delete registry[id];

  const forEach = callback => Object.values(registry).forEach(
    (value, index) => callback(value, index)
  );

  const getRegistry = () => registry;

  return {
    add,
    forEach,
    getRegistry,
    remove,
  };
};
