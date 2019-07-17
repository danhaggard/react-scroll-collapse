import { getNextIdFactory } from '../utils/selectorUtils';
import { isInArray } from '../utils/arrayUtils';

/*
  burn this with fire.
*/
const getChildTargetMapping = (childArray, targetNodeArray) => {
  const targetNodeArrayChildMapping = [];
  let currentChildIdObj = childArray.shift();
  let nextChild = childArray[0];
  let currentChildTargetArray = [];
  let foundChildTarget = true;
  let targetNode;
  while (targetNodeArray.length > 0 || (targetNode && currentChildIdObj !== undefined)) {
    if (foundChildTarget) {
      targetNode = targetNodeArray.shift();
    }

    foundChildTarget = currentChildIdObj.treeId <= targetNode.treeId
      && (nextChild === undefined || targetNode.treeId < nextChild.treeId);
    if (foundChildTarget) {
      currentChildTargetArray.push(targetNode);
      targetNode = null;
    }

    if ((!foundChildTarget || targetNodeArray.length === 0) && currentChildTargetArray.length > 0) {
      targetNodeArrayChildMapping.push({
        currentNodeIdObj: currentChildIdObj,
        targetNodeArray: currentChildTargetArray
      });
    }

    if (!foundChildTarget && targetNodeArray.length >= 0) {
      currentChildIdObj = childArray.shift();
      [nextChild] = childArray;
      currentChildTargetArray = [];
    }
  }
  return targetNodeArrayChildMapping;
};

// Helper func.
export const getChildResultValuesAndSources = (childArray, recurseFunc, recurseFuncArgs) => {

  const resultSources = [];
  const resultValues = [];

  childArray.forEach(({ currentNodeIdObj, targetNodeArray }) => {
    const value = recurseFunc({ ...recurseFuncArgs, currentNodeIdObj, targetNodeArray });
    resultValues.push(value);
    if (value === false) {
      resultSources.push(currentNodeIdObj);
    }
  });

  return [resultSources, resultValues];
};

/*
  recurseToNode - find fastest path to a specific node - then recurse through
    all children after that point if necessary (
      currently an ALL condition - TODO: make this condition an argument.
  )
*/
const recurseToNodeArray = (argsObj) => {

  const {
    cache,
    getNodeChildrenMappedToTreeId,
    setNestedCacheValues, // a function which takes a node id and a cached value of the current node
    // and determines a value for which it will set the cache for all children.
    currentNodeIdObj, // obj with id  and treeId of the node we are currently at.
    resultReducer, // takes an array - and returns a single value
    getNodeValue, // Func that takes an id and returns the value for that node.
    targetNodeArray, // id objs of the target nodes.
    counter = getNextIdFactory(argsObj.currentNodeIdObj.id - 1),
    setTreeId = false,
    rootNodeId,
    flipChildValues,
    /*
      flipChildValues: once it reaches  targetnode - it will flip all the
      values of its children if true to save on child selectoring.
      Added this config because you do not want to flip all child
      collapsers if you just expanded/collapsed a single item.
    */
  } = argsObj;

  /*
    The cache is serving two purposes.

    1) caching of false value sources to reduce tree traversal.

    2) To cache the value of each node as we traverse it.  This is because
      every collapser will query for its own state on render- and without the
      cache will traverse the whole tree from itself down.  This problem
      get exponential with tree size.

      But since the root node must traverse the whole tree on first render,
      we can save results along the way.
  */
  const currentNodeId = currentNodeIdObj.id;
  debugger;
  const cachedValue = cache.getResultValue(currentNodeId);
  const cachedSources = cache.getResultSources(currentNodeId);

  if (currentNodeId === 14) {
    debugger;
  }

  if (setTreeId && currentNodeId === rootNodeId) {
    counter.resetCounter();
  }

  /* sets tree ids to the cache on first traversal on mount */
  if (setTreeId || targetNodeArray.length === 0) {
    cache.setResultTreeId(currentNodeId, counter());
  }

  // We have reached the targetNode - just ensure all children have the reverse
  // of the current cached value. NOTE: this cheat won't generalise well.
  // we do this before checking anything else to save on addition child selections
  if (
    flipChildValues
    && !setTreeId
    && targetNodeArray.length === 1 && targetNodeArray[0].id <= currentNodeId
  ) {
    return setNestedCacheValues(currentNodeIdObj, cachedValue);
  }

  // the value returned by this node in isolation of it's children.
  const currentValue = getNodeValue(currentNodeId);

  // Arrays of child nodeIds we are going to recurse into.
  const childArray = getNodeChildrenMappedToTreeId(currentNodeId);

  // no children- just return.
  if (childArray.length === 0) {
    return cache.addResult(currentNodeId, currentValue, []);
  }


  // it will be zero when no targets have been set - e.g. checking from root on
  // very first render.  Need to do proper recurse because we don't know
  // whether cached value for root node is accurate.
  if (targetNodeArray.length === 0 || setTreeId) {

    const [resultSources, resultValues] = getChildResultValuesAndSources(
      // todo: figure out better place to do this mapping.
      childArray.map(child => ({ currentNodeIdObj: child, targetNodeArray })),
      recurseToNodeArray,
      {
        ...argsObj,
        counter,
        setTreeId: true,
      }
    );

    const val = resultReducer([currentValue, ...resultValues]);
    return cache.addResult(
      currentNodeId,
      val,
      resultSources,
    );
  }

  /*
    We are still above the target node.  Get the next node.

    Nodes are ordered by depth and to the left. e.g.

    Exclude nodes > targetnode then choose the maximum of any remaining.

    e.g.

      0
     / \
    1   2
      / | \
     3  4  7
      / \  | \
     5   6 8  9


     0
    / \
   1   2
     / | \
    3  4  7
     / \   \
    5   13  14
  / | \
6   8  10
|   |  |
7   9  11
       |
       12

  /*
    Create targetNodeArray for each child.

    Algo:

    Iterate through child array:
      iterate through target array:
        if targetNode is > child & less < min(remaining siblings):
          pop targetNode and append to new targetNodeArray for this child.
  */

  const childTargetMapping = getChildTargetMapping(childArray, targetNodeArray);

  const [resultSources, resultValues] = getChildResultValuesAndSources(
    childTargetMapping,
    recurseToNodeArray,
    { ...argsObj }
  );

  const val = resultReducer([currentValue, ...resultValues]);


  /*
    If this node was previously false and now true - then it might be the
    case that another child pushed up a false value that caused this node
    to return false too.

    Check the source cache.

    If the node(s) we just checked were the only source of this falsity,
    Then we don't gotta worry.  Just return and replace the cache,
    removing the nodes we just checked from  the sources.

  */
  const cachedSourceInChildren = cachedIdObj => isInArray(
    cachedIdObj,
    childTargetMapping,
    obj => obj.id,
    obj => obj.currentNodeIdObj.id
  );

  const areAllCachedSourcesInChildrenJustChecked = cachedSources.every(cachedSourceInChildren);
  if (
    cachedValue === false && val === true
    && areAllCachedSourcesInChildrenJustChecked
  ) {

    return cache.addResult(
      currentNodeId,
      val,
      []
    );
  }


  if (cachedValue === false && val === true) {
    /*
      If we are here then the falsity must have come from somewhere else.
      Return that - and remove the just checked node from the sources.
    */
    return cache.addResult(
      currentNodeId,
      cachedValue,
      cachedSources.filter(cachedIdObj => !cachedSourceInChildren(cachedIdObj))
    );
  }

  /*
    Otherwise just return and add (uniquely) to the false sources.
  */
  const newCachedSources = [...cachedSources];
  if (val === false) {
    resultSources.forEach((source) => {
      if (!isInArray(source, cachedSources, obj => obj.id, obj => obj.id)) {
        newCachedSources.push(source);
      }
    });
  }

  return cache.addResult(
    currentNodeId,
    val,
    newCachedSources
  );

  /*
    TODO: this just handles ALL logic - update so it can handle SOME
    or NONE selectors.

    1) Let an injected func determine on what value to automatically invalidate
      as opposed to just false.
    2) Apply the resultReducer to cached value plus child value where
      appropriate.
  */

};

export default recurseToNodeArray;
