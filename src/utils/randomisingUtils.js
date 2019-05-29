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
  maxWords = 50,
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

export const generateRandomArray = () => [...Array(getRandomInt(10, 100)).keys()].map(
  () => getRandomInt(10, 100)
);
