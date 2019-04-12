/*
[...Array(noOfWords).keys()].forEach(() => {
  randText += ` ${getRandString()}`;
});
*/


const doEachForNumber = (num, callBack) => [...Array(num).keys()].forEach(
  i => callBack(i)
);

export default doEachForNumber;
