import { getNextIdFactory } from '../utils/selectorUtils';

const recurseAllChildren = (
  getNodeChildren,
  getNodeValue,
  resultReducer,
  id,
) => {

  const concatChildren = (currentNodeId, counter) => {

    // const nodeValue = getNodeValue(arr[i]);
    resultReducer(currentNodeId, counter());

    const nextChildren = getNodeChildren(currentNodeId);
    nextChildren.forEach(childId => concatChildren(childId, counter));
  };

  const counter = getNextIdFactory(id - 1);
  // const nodeValue = getNodeValue(currentNodeId);
  // resultReducer(currentNodeId, count);
  return concatChildren(id, counter);
};

export default recurseAllChildren;
