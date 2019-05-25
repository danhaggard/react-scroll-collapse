import { getNextIdFactory } from '../../src/utils/selectorUtils';


/*
  This comes from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
*/
export const getRandomInt = (minArg, maxArg) => {
  const min = Math.ceil(minArg);
  const max = Math.floor(maxArg);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/*
  This comes from: http://stackoverflow.com/a/8084248/1914452

export const getRandString = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const N = Math.floor((Math.random() * 10) + 1);
  const selection = [...Array(N).keys()].map(
    () => letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('');
  return selection;
};

/*
  The Array.apply trick used here I learnt from:
    http://stackoverflow.com/a/20066663/1914452

export const genRandText = () => {
  let randText = '';
  const noOfWords = Math.floor((Math.random() * 30) + 10);
  [...Array(noOfWords).keys()].forEach(() => {
    randText += ` ${getRandString()}`;
  });
  return randText;
};
*/

/*
  This comes from: http://stackoverflow.com/a/8084248/1914452
*/
export const getRandString = (minSize = 1, maxSize = 10) => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const N = getRandomInt(minSize, maxSize);
  const selection = [...Array(N).keys()].map(
    () => letters.charAt(Math.floor(Math.random() * letters.length))
  ).join('');
  return selection;
};

/*
  The Array.apply trick used here I learnt from:
    http://stackoverflow.com/a/20066663/1914452
*/
export const genRandText = (
  minWords = 20,
  maxWords = 100,
  minWordSize = 1,
  maxWordSize = 10
) => {
  let randText = '';
  const noOfWords = getRandomInt(minWords, maxWords);
  [...Array(noOfWords).keys()].forEach(() => {
    randText += ` ${getRandString(minWordSize, maxWordSize)}`;
  });
  return randText;
};


const getNodeChildren = (
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

const getNodeObj = (count, depth, index) => ({
  comment: genRandText(),
  key: `comment-${count}`,
  title: `depth: ${depth} - branch: ${index}`,
});

export const generateCommentThreadData = (
  minChildren,
  minDepth,
  maxChildren,
  maxDepth,
  initCount = -1,
) => {
  const recurseFunc = (
    allowedDepth,
    currentNodeIndex,
    currentDepth,
    currentChildNumber,
    counter
  ) => {
    const count = counter(initCount);
    const nodeData = {
      ...getNodeObj(count, currentDepth, currentNodeIndex),
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
