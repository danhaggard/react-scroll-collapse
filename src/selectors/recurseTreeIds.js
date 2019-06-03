import { getNextIdFactory } from '../utils/selectorUtils';

const recurseTreeIds = (
  getNodeChildren,
  resultReducer,
  id,
) => {
  const concatChildren = (currentNodeId, counter) => {
    console.log(`recurseTreeIds at node ${currentNodeId} and counter value: ${counter.getCurrent() + 1}`);
    resultReducer(currentNodeId, counter());
    const nextChildren = getNodeChildren(currentNodeId);
    nextChildren.forEach(childId => concatChildren(childId, counter));
  };
  const counter = getNextIdFactory(id - 1);
  return concatChildren(id, counter);
};

export default recurseTreeIds;
