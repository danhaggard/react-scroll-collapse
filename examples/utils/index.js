
/*
  This comes from: http://stackoverflow.com/a/8084248/1914452
*/
const getRandString = () => {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  const N = Math.floor((Math.random() * 10) + 1);
  const selection = Array.apply(null, Array(N)).map(
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
  const noOfWords = Math.floor((Math.random() * 50) + 10);
  Array.apply(null, {length: noOfWords}).forEach(() => {
    randText += ` ${getRandString()}`;
  });
  return randText;
};
