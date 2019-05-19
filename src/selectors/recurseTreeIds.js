import { getNextIdFactory } from '../utils/selectorUtils';

const recurseTreeIds = (
  getNodeChildren,
  getNodeValue,
  resultReducer,
  id,
) => {
  const concatChildren = (currentNodeId, counter) => {
    resultReducer(currentNodeId, counter());
    const nextChildren = getNodeChildren(currentNodeId);
    nextChildren.forEach(childId => concatChildren(childId, counter));
  };
  const counter = getNextIdFactory(id - 1);
  return concatChildren(id, counter);
};

export default recurseTreeIds;
