/*
  Keep the most recent, rightmost members of arr1 - add the members of arr2
  to the right.
*/
export const addShiftArray = (arr1, arr2, maxLength) => {
  /*
    If arr2.length > 0 - then to get your arr 1 start index, start at zero
    and step right the length of arr2.  That's how many arr1 shift arr1 members
    out to the left. To get the end index step right the number of paces the
    max length allows.

    If arr2.length = 0, to get your arr 1 start index, then you need to start
    at the end of arr1, to get the end index step right the number of paces the
    max length allows.
  */
  const [start, end] = arr2.length > 0 ? [arr2.length, maxLength]
    : [arr1.length - maxLength, maxLength];
  return [...arr1.slice(start, end), ...arr2].slice(0, maxLength);
};


// credit for dedupe funcs: https://stackoverflow.com/questions/14930516/compare-two-javascript-arrays-and-remove-duplicates

/*
  perf note: https://jsperf.com/dedupe-two-arrays/1

  filter is better for small arrays - Set is better for larger arrays.
  Variance doesn't seem to matter.
*/
export const dedupeArraysByFilter = (arr1, arr2) => arr1.filter(val => !arr2.includes(val));

export const dedupeArraysBySet = (arr1, arr2) => [...new Set([...arr1, ...arr2])];


export const isInArray = (toCheck, arr, toCheckGetter, arrItemGetter) => {
  let len = arr.length;
  let found = false;
  while (len) {
    len -= 1;
    const item = arr[len];
    if (arrItemGetter(item) === toCheckGetter(toCheck)) {
      found = true;
      break;
    }
  }
  return found;
};

export const compareIntArrays = (arr1, arr2) => {
  let len = arr1.length;
  if (len !== arr2.length) {
    return false;
  }
  if (len === arr2.length === 0) {
    return true;
  }
  while (len) {
    len -= 1;
    if (arr1[len] !== arr2[len]) {
      return false;
    }
  }
  return true;
};


export const loopArrayIndex = (array, index) => {
  const { length } = array.length;
  if (index <= -1) {
    return length - 1;
  }

  if (index >= length) {
    return 0;
  }

  return index;
};

export const insertAtIndex = (arr1, arr2, index = null) => {
  if (!Array.isArray(arr2)) {
    return insertAtIndex(arr1, [arr2], index);
  }
  if (index < 0) {
    return insertAtIndex(arr1, arr2, index + arr1.length);
  }
  if (index === 0 || index === null) {
    return [...arr2, ...arr1];
  }
  if (index >= arr1.length) {
    return [...arr1, ...arr2];
  }
  return [...arr1.slice(0, index), ...arr2, ...arr1.slice(index)];
};


export const removeFromArray = (array, index = 0) => {
  const { length } = array;
  if (index < 0) {
    return removeFromArray(array, index + length);
  }

  if (index === 0) {
    return array.slice(1, length);
  }

  if (length - 1 === index) {
    return array.slice(0, index);
  }

  return [...array.slice(0, index), ...array.slice(index + 1, length)];
};

// from: https://stackoverflow.com/a/1063027
export const sortArrayAscending = array => array.sort((a, b) => a - b);

export const sortArrayDescending = array => array.sort((a, b) => b - a);

// The Array.apply trick used here I learnt from: http://stackoverflow.com/a/20066663/1914452
export const arrayFromNumber = number => [...Array(number).keys()];

export const doFromNumber = method => (number, callBack) => (
  arrayFromNumber(number)[method](n => callBack(n))
);

export const mapFromNumber = doFromNumber('map');

export const forEachNumber = doFromNumber('forEach');


// find the maximum of the array and add one to it. zero index.
/*
export const getNextIdFromArr = arr => (arr.length < 1 ? 0 : Math.max(...arr) + 1);

export const getNextIdFromObj = (obj) => {
  const keys = Object.keys(obj);
  return getNextIdFromArr(keys);
};
*/
