import { getNextIdFactory } from './selectorUtils';
import { getRandomInt, getRandomTextWithDefaults } from './randomUtils';

export const getNodeChildren = (
  allowedDepth,
  counter,
  currentChildNumber,
  currentDepth,
  minChildren,
  maxChildren,
  recurseFunc,
) => {
  if (currentDepth >= allowedDepth) {
    return [];
  }
  const nextChildNumber = getRandomInt(minChildren, maxChildren);
  return [...Array(currentChildNumber).keys()].map(
    nodeIndex => recurseFunc(
      allowedDepth,
      nodeIndex,
      currentDepth,
      nextChildNumber,
      counter
    )
  );
};

export const getNodeObj = (count, depth, index) => ({
  comment: getRandomTextWithDefaults(),
  branch: index,
  count,
  depth,
  key: `comment-${count}`,
  title: `depth: ${depth} - branch: ${index}`,
});

export const generateCommentThreadData = ({
  minChildren,
  minDepth,
  maxChildren,
  maxDepth,
},
initCount = -1,
initialDepthCount = 0) => {
  const recurseFunc = (
    allowedDepth,
    currentNodeIndex,
    currentDepth,
    currentChildNumber,
    counter
  ) => {
    const count = counter(initCount);
    const countModifier = initCount === -1 ? 0 : initCount;
    const nodeData = {
      ...getNodeObj(
        count + countModifier,
        currentDepth + initialDepthCount,
        currentNodeIndex + countModifier,
      ),
      children: getNodeChildren(
        allowedDepth,
        counter,
        currentChildNumber,
        currentDepth + 1,
        minChildren,
        maxChildren,
        recurseFunc
      )
    };
    nodeData.countReached = counter.getCurrent();
    return nodeData;
  };

  const childNumber = getRandomInt(minChildren, maxChildren);
  const allowedDepth = getRandomInt(minDepth, maxDepth);
  const counter = getNextIdFactory();

  return recurseFunc(
    allowedDepth,
    0,
    0,
    childNumber,
    counter,
  );
};
