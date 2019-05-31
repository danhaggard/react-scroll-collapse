

export const filterObject = (objToFilter, objToFilterBy) => { //eslint-disable-line
  const newObj = {};
  Object.entries(objToFilter).forEach(([key, value]) => {
    if (!Object.keys(objToFilterBy).includes(key)) {
      newObj[key] = value;
    }
  });
  return newObj;
};

export const addPropertiesToObject = (objA, objB) => Object.entries(objB).forEach(([key, value]) => (objA[key] = value));  // eslint-disable-line

/*
{
  collapser: parentCollapserId, scroller: parentScrollerId
},
*/


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
