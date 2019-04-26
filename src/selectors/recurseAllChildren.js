const recurseAllChildren = (
  getNodeChildren,
  getNodeValue,
  resultReducer,
  id,
) => {

  const concatChildren = (i, arr) => {
    const nodeValue = getNodeValue(arr[i]);
    if (i + 1 > arr.length) {
      return nodeValue;
    }
    const nextChildren = getNodeChildren(arr[i]);
    return resultReducer(nodeValue, concatChildren(i + 1, [...arr, ...nextChildren]));
  };

  const nodeValue = getNodeValue(id);
  return resultReducer(nodeValue, concatChildren(0, getNodeChildren(id)));
};

export default recurseAllChildren;
