import createCache from '../caching/recursionCache';
import providerCaches from '../caching/providerCaches';

export const getRootNodeId = (ownId, {
  isRootNode,
  rootNodes,
  providerType
}) => (isRootNode ? ownId : rootNodes[providerType]);

export const whyUpdate = (state, nextState, component, id, checkAgainst = []) => {
  Object.keys(state).forEach((key) => {
    if (!checkAgainst.includes(key) && state[key] !== nextState[key]) {
      if (id === 1) {
        // debugger;
      }
      console.log(`whyUpdate:  ${component} - id: ${id}, key: ${key}, value: ${state[key]}, nextValue: ${nextState[key]}`); // eslint-disable-line
    }
  });
};

export const compareIntArrays = (arr1, arr2) => {
  let len = arr1.length;
  if (len !== arr2.length) {
    return false;
  }
  while (len) {
    len -= 1;
    if (arr1[len] !== arr2[len]) {
      return false;
    }
  }
  return true;
};

export const getCache = (props) => {
  const { collapserId, isRootNode, providerType } = props;
  const rootNodeId = getRootNodeId(collapserId, props);
  const providerCache = providerCaches[providerType];
  if (isRootNode) {
    providerCache[rootNodeId] = createCache();
  }
  return providerCache[rootNodeId];
};

export const shouldLogProvider = (props, state, id, log) => {
  if (!Object.keys(props).includes('isOpenedInit')) {
    console.log(log, id, props, state); // eslint-disable-line
  }
};
