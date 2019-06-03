export const createForkedNodesTracker = (rootNodeId) => {  // eslint-disable-line
  let prevLargestActiveFork = null;
  let largestActiveFork = null;
  let lowestActiveFork = null;
  let rangeUpperBound = null;

  let orphanNodes = {};
  let forkedNodes = {};
  let checkedParents = {};

  const checkIfOrphanedNode = (parentNodeId, nodeId) => {
    if (lowestActiveFork === null) {
      return false;
    }
    if (parentNodeId === lowestActiveFork || parentNodeId === largestActiveFork) {
      return false;
    }

    const isOrphan = (lowestActiveFork < parentNodeId && parentNodeId < rangeUpperBound);
    if (lowestActiveFork < parentNodeId && parentNodeId < rangeUpperBound) {
      const orphanNodeObj = {
        nodeId,
        parentNodeId,
        rangeStart: lowestActiveFork,
        rangeEnd: rangeUpperBound
      };

      orphanNodes[parentNodeId] = orphanNodeObj;
      console.log(`nodeId ${nodeId} is orphaned by parent: ${parentNodeId} because`, orphanNodeObj);
      return true;
    }


    return isOrphan; // (lowestActiveFork < id && id < rangeUpperBound);
  };


  const logCurrentOrphanRange = () => {
    const message = `rangeStart: ${lowestActiveFork} - rangeEnd: ${rangeUpperBound}.`;
    console.log(message);

    if (lowestActiveFork < largestActiveFork && largestActiveFork < rangeUpperBound) {
      const message2 = `Note that the largestActiveFork: ${largestActiveFork} is currently within this range and is excluded.  You can mount there!`;
      console.log(message2);
    }
  };

  const clearCheckedParents = () => (checkedParents = {});

  const clearOrphanNodes = () => (orphanNodes = {});

  const getOrphanNodes = () => orphanNodes;

  const getForkedNodes = () => forkedNodes;

  const clearForkedNodes = () => (forkedNodes = {});

  const clearAllNodes = () => (clearOrphanNodes() && clearForkedNodes() && clearCheckedParents());

  const logAllNodes = () => console.log('orphanNodes, forkedNodes', orphanNodes, forkedNodes);

  const addToCheckedParents = (parentNodeId, nodeId) => {
    const newCheckedParent = {
      id: parentNodeId,
      chlidren: nodeId,
    };
    if (!checkedParents[parentNodeId]) {
      checkedParents[parentNodeId] = newCheckedParent;
    } else {
      checkedParents[parentNodeId].children.push(nodeId);
    }
    console.log('checkedParents', checkedParents);
  };


  const checkIfFork = (nodeId, parentNodeId) => {

    /*
      If in a mount sequence node is > + 1 parent, then it has been mounted
      higher up in the tree than the last mounted node.  Doesn't always mean a fork
      though.
    */
    const isFork = nodeId - parentNodeId > 1
      /*
      You can't orphan a node by branching from root.
      */
      && parentNodeId !== rootNodeId
      /*
        Check if a parent has a child - since you can fork what doesn't have
        at least one child.
      */
      && checkedParents[parentNodeId]
      /*
        You can still fork from the points at which determine the current range
        within which parents will orphan new nodes.
      */
      && (parentNodeId !== lowestActiveFork || parentNodeId !== largestActiveFork);

    // basically re caching duplicate info - but this is dirty for now.
    addToCheckedParents(parentNodeId, nodeId);

    if (!isFork) {
      return false;
    }
    forkedNodes[parentNodeId] = {
      parentNodeId,
      nodeId,
      lowestActiveFork,
      largestActiveFork
    };
    console.log(`nodeId: ${nodeId} is child of fork parentId: ${parentNodeId}`);
    // console.log(`largestActiveFork - before set: ${largestActiveFork}`);
    // console.log(`lowestActiveFork - before set: ${lowestActiveFork}`);
    lowestActiveFork = parentNodeId !== rootNodeId
      && (lowestActiveFork === null
        || parentNodeId < lowestActiveFork) ? parentNodeId : lowestActiveFork;

    largestActiveFork = lowestActiveFork !== null
      && parentNodeId > largestActiveFork ? parentNodeId
      : largestActiveFork; // && parentNodeId > lowestActiveFork

    prevLargestActiveFork = prevLargestActiveFork !== largestActiveFork
      ? largestActiveFork : prevLargestActiveFork;
    // console.log(`lowestActiveFork - after set: ${lowestActiveFork}`);
    // console.log(`largestActiveFork - after set: ${largestActiveFork}`);
    rangeUpperBound = nodeId;
    return true;
  };

  const checkForkOrphan = (nodeId, parentNodeId) => {
    if (parentNodeId === undefined || parentNodeId === null) {
      return false;
    }

    if (nodeId !== rootNodeId) {
      const isOrphaned = checkIfOrphanedNode(parentNodeId, nodeId);
      if (!isOrphaned) {
        checkIfFork(nodeId, parentNodeId);
      }
    }
  };

  const returnObj = {
    checkIfFork,
    getOrphanNodes,
    clearOrphanNodes,
    checkIfOrphanedNode,
    clearAllNodes,
    checkForkOrphan,
    logAllNodes,
    logCurrentOrphanRange,
    orphanNodes,
    forkedNodes
  };
  // console.log('orphan cache', returnObj);
  // console.log('logAllNodes', returnObj.logAllNodes);
  // console.log('logCurrentOrphanRange', returnObj.logCurrentOrphanRange);
  window.logAllNodes = returnObj.logAllNodes;
  window.logOrphanRange = returnObj.logCurrentOrphanRange;
  return returnObj;
};
