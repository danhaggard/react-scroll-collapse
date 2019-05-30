import { mapFromNumber, forEachNumber } from './arrayUtils';

const RANDOM_TEXT_DEFAULTS = {
  minWordCount: 20,
  maxWordCount: 50,
  minWordLength: 1,
  maxWordLength: 10
};

/*
  This comes from: https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
*/
export const getRandomInt = (minArg, maxArg) => {
  const min = Math.ceil(minArg);
  const max = Math.floor(maxArg);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomIndex = length => getRandomInt(0, length);

export const getRandomFromIter = iterable => iterable[getRandomIndex(iterable.length)];

export const generateRandomIterable = baseIter => (minSize, maxSize) => mapFromNumber(
  getRandomInt(minSize, maxSize),
  () => getRandomFromIter(baseIter)
);

export const getRandomLetterArray = generateRandomIterable('abcdefghijklmnopqrstuvwxyz');

// This is a refactored version of: http://stackoverflow.com/a/8084248/1914452
export const getRandomLetters = (minSize, maxSize) => getRandomLetterArray(minSize, maxSize).join('');

export const getRandomText = ({
  minWordCount,
  maxWordCount,
  minWordLength,
  maxWordLength
}) => mapFromNumber(
  getRandomInt(minWordCount, maxWordCount),
  () => getRandomLetters(minWordLength, maxWordLength)
).join(' ');

export const getRandomTextWithDefaults = () => getRandomText(RANDOM_TEXT_DEFAULTS);


export const generateRandomArray = () => [...Array(getRandomInt(10, 100)).keys()].map(
  () => getRandomInt(10, 100)
);
