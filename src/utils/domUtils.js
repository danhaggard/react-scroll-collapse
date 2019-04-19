export const getStyleInt = str => parseInt(str.slice(0, -2), 10);

export const getRightOffset = (node) => {
  const positions = ['absolute', 'relative'];
  const style = getComputedStyle(node);
  let rightOffset = getStyleInt(style.marginRight);
  if (positions.includes(style.position)) {
    rightOffset += getStyleInt(style.right);
  }
  return rightOffset;
};

/*
  Iterate through all the child nodes, find the element with the rightmost
  position on the screen.
*/
export const getRightMostChildNodeValue = (elem) => {
  let highestValue = 0;
  Array.from(elem.children).forEach((child) => {
    const { right } = child.getBoundingClientRect();
    const rightOffset = getRightOffset(child);
    highestValue = rightOffset + right > highestValue ? rightOffset + right : highestValue;
  });
  return highestValue;
};

export const targetIsScrollBar = (clientX, element) => {
  const rightMostChildValue = getRightMostChildNodeValue(element);
  const { right } = element.getBoundingClientRect();
  /*
    Won't work reliably if children are wrapping elements.
    In such a case the right most child is likely to be much further
    away from the scrollbar.  In which case we simply disable detection.
  */
  if (right - rightMostChildValue > 50) {
    return false;
  }
  return clientX < right && clientX > rightMostChildValue;
};
