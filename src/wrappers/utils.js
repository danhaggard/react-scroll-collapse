export const getRootNodeId = ({
  isRootNode,
  collapserId,
  rootNodes,
  providerType
}) => (isRootNode ? collapserId : rootNodes[providerType]);

export const whyUpdate = (state, nextState, component, id, checkAgainst = []) => {
  Object.keys(state).forEach((key) => {
    if (!checkAgainst.includes(key) && state[key] !== nextState[key]) {
      if (id === 1) {
        // debugger;
      }
      console.log(`whyUpdate:  ${component} - id: ${id}, key: ${key}, value: ${state[key]}, nextValue: ${nextState[key]}`);
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
