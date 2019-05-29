import hasOwnProperty from './hasOwnProperty';
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

/*
const createCompareCondition = defaultCondition => condition => (objB, objA) => key => (
  !hasOwnProperty(objB, key) || !condition(objB[key], objA[key], defaultCondition)
);
*/

const createCompareCondition = (defaultCondition) => {
  return (condition) => {
    return (objB, objA) => (key) => {
      const a = !hasOwnProperty(objB, key);
      const b = !condition(objB[key], objA[key], defaultCondition);
      return (a || b);
    };
  };
};

const objKeyValShallowEquals = (valA, valB) => (valA === valB);

const defaultCondition = createCompareCondition(objKeyValShallowEquals);

const checkArrayCondition = (valA, valB, condition) => {
  if (Array.isArray(valA) && Array.isArray(valB)) {
    return compareIntArrays(valA, valB);
  }
  return condition(valA, valB);
};

export const shallowEqualExcept = (
  condition = defaultCondition(objKeyValShallowEquals)
) => (objA, objB) => {

  if (objA === objB) {
    return true;
  }

  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  const finalCondition = condition(objA, objB);

  // Test for A's keys different from B.
  return !Object.keys(objA).some(key => finalCondition(key));

};

const arrayCondition = defaultCondition(checkArrayCondition);

export const shallowEqualExceptArray = shallowEqualExcept(arrayCondition);
