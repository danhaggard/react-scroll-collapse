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
*/
export const genRandText = () => {
  let randText = '';
  const noOfWords = Math.floor((Math.random() * 100) + 50);
  [...Array(noOfWords).keys()].forEach(() => {
    randText += ` ${getRandString()}`;
  });
  return randText;
};
