const createArrayGetter = getter => (arr, i) => {
  let value = arr[i];
  if (getter) {
    value = getter(value);
  }
  return value;
};

const arrayMax = (arr, getter = createArrayGetter()) => {
  let len = arr.length;
  let max = -Infinity;
  while (len) {
    len -= 1;
    const val = getter(arr, len);
    if (val > max) {
      max = val;
    }
  }
  return max;
};

/*
  babel choking on Math.max

  Credit for this to: https://stackoverflow.com/a/13440842

const arrayMax = (arr) => {

  let len = arr.length;
  let max = -Infinity;
  while (len) {
    len -= 1;
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
};
*/
// Helper func.
export const getChildResultValuesAndSources = (childArray, recurseFunc, recurseFuncArgs) => {

  const resultSources = [];
  const resultValues = [];

  childArray.forEach((nextNodeId) => {
    const value = recurseFunc({ ...recurseFuncArgs, currentNodeId: nextNodeId });
    resultValues.push(value);
    if (value === false) {
      resultSources.push(nextNodeId);
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
const recurseToNode = (argsObj) => {

  const {
    cache,
    getNodeChildren, // Returns an array of ids of the children of the current node
    currentNodeId, // id of the node we are currently at.
    resultReducer, // takes an array - and returns a single value
    getNodeValue, // Func that takes an id and returns the value for that node.
    getTreeId, // Func that takes an id and returns the treeId for that node.
    targetNodeId, // id of the target node.
    reachedTargetNode, // boolean
  } = argsObj;

  /*
    The cache is serving two purposes.

    1) caching of false value sources to reduce tree traversal.

    2) To cache the value of each node as we traverse it.  This is because
      every collapser will query for its own state on render- and without the
      cache will traverse the whole tree from itself down.  This problem
      get exponential with tree size.

      But since the root node must traverse the whole tree on first render,
      we can save results along the way. The root collapser unlocks the cache
      so the recursion func knows to recurse as needed. Then the root
      collapser locks it when it is finished so subsequent nodes are given
      cached vals.
  */
  debugger;
  const cachedValue = cache.getResultValue(currentNodeId);
  const cachedSources = cache.getResultSources(currentNodeId);

  if (cachedValue !== null && cache.isCacheLocked()) {
    return cachedValue;
  }

  /*
    treeIds represent the physical position in the tree.  This might change
    render to render.  nodeId should never change for each node.
  */
  const currentNodeTreeId = getTreeId(currentNodeId);
  const targetNodeTreeId = getTreeId(targetNodeId);

  // the value returned by this node in isolation of it's children.
  const currentValue = getNodeValue(currentNodeId);

  // Arrays of child nodeIds we are going to recurse into.
  const childArray = getNodeChildren(currentNodeId);

  // no children- just return.
  if (childArray.length === 0) {

    /*
      Caching itself as a falsity source causes problems currently in the scenario
      where it has children - but not when it doesn't,

      TODO: investigate why - and how this handles changes to indidual
      collapserItem state changes.
    */
    return cache.addResult(currentNodeId, currentValue, []);
  }

  // const reachedTargetNodeCheck = reachedTargetNode || currentNodeId === targetNodeId;
  const reachedTargetNodeCheck = reachedTargetNode
    || targetNodeTreeId === null // will occur when previous targetnode has been removed. (not sure if this will handle all cases yet)
    || currentNodeTreeId === targetNodeTreeId;


  if (reachedTargetNodeCheck || targetNodeId < 0) {
    /*
      We are below the targetNode.

      We assume that the event could have changed anything below this node,
      So now we have to recurse into all children
    */

    const [resultSources, resultValues] = getChildResultValuesAndSources(
      childArray,
      recurseToNode,
      { ...argsObj, reachedTargetNode: reachedTargetNodeCheck }
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

     6 is the target.

     Start at 0.
     1 & 2 both < 6 so choose max = 2
     7 > 6 - so exclude.  Choose max of (4, 3) = 4
     Now choose the target.
  */

  // const nextNodeId = arrayMax([...childArray.filter(id => (id <= targetNodeId))]);
  // babel is choking on Math.max atm.

  // TODO: rather than map child ids to {id, treeId} here - replace the getNodeChildren
  // selector with one that does this at the start.
  const nextNodeId = arrayMax([...childArray.map(id => ({ id, treeId: getTreeId(id) }))
    .filter(({ treeId }) => (treeId <= targetNodeTreeId))], createArrayGetter(obj => obj.id));


  const val = resultReducer([currentValue, recurseToNode({
    ...argsObj,
    currentNodeId: nextNodeId
  })]);

  /*
    If this node was previously false and now true - then it might be the
    case that another child pushed up a false value that caused this node
    to return false too.

    Check the source cache.

    If the node we just checked was the only source of this falsity,
    Then we don't gotta worry.  Just return and replace the cache,
    removing the node we just checked from  the sources.
  */
  if (
    cachedValue === false && val === true
    && cachedSources.length === 1 && cachedSources.includes(nextNodeId)
  ) {

    return cache.addResult(
      currentNodeId,
      val,
      cachedSources.filter(id => id !== nextNodeId)
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
      cachedSources.filter(id => id !== nextNodeId)
    );
  }

  /*
    Otherwise just return and add (uniquely) to the false sources.
  */
  return cache.addResult(
    currentNodeId,
    val,
    val === false ? [...new Set([...cachedSources, nextNodeId])] : cachedSources
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

export default recurseToNode;
