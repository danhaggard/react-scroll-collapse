export const createForkedNodesTracker = (rootNodeId) => {  // eslint-disable-line
  let activeForks = {};
  let largestActiveFork = null;
  let lowestActiveFork = null;
  let rangeUpperBound = null;

  let orphanNodes = {};
  let allForkedNodes = {};
  let checkedParents = {};

  const checkIfOrphanedNode = (parentNodeId, nodeId) => {
    if (lowestActiveFork === null) {
      return false;
    }
    if (parentNodeId === lowestActiveFork || parentNodeId === largestActiveFork) {
      // return false;
    }

    /*
      activeForks[parentNodeId] = {
        id: parentNodeId,
        rangeEnd: nodeId
      };
    */
    const parentIsOrphan = orphanNodes[parentNodeId];

    let isOrphan = false;

    let responsibleFork = null;
    if (!parentIsOrphan) {
      isOrphan = Object.entries(activeForks).some(([id, fork]) => {
        const foundFork = id < parentNodeId && parentNodeId < fork.rangeEnd;
        if (foundFork) {
          responsibleFork = fork;
        }
        return foundFork;
      });
    }

    let orphanObj = {
      id: nodeId,
      parentNodeId,
    };

    if (parentIsOrphan) {
      orphanObj = {
        ...orphanNodes[parentNodeId],
        ...orphanObj,
      };
    }

    if (isOrphan) {
      orphanObj = {
        ...orphanObj,
        rootOrphan: nodeId,
        rangeStart: responsibleFork.id,
        rangeEnd: responsibleFork.rangeEnd,
      };
    }

    if (isOrphan || parentIsOrphan) {
      orphanNodes[nodeId] = orphanObj;
      console.log(`nodeId ${nodeId} is orphaned by parent: ${parentNodeId} because`, orphanObj);
      console.log(`all orphan nodes: `, orphanNodes);

    }
    return isOrphan || parentIsOrphan;

  };


  const logCurrentOrphanRange = () => {
    const getRangeString = (start, end) => `rangeStart: ${start} - rangeEnd: ${end}.`;
    console.log('Current Active Orphan ranges are: ');
    Object.entries(activeForks).forEach(([id, fork]) => console.log(`${getRangeString(id, fork.rangeEnd)}`));
  };

  const clearCheckedParents = () => (checkedParents = {});

  const clearOrphanNodes = () => (orphanNodes = {});

  const getOrphanNodes = () => orphanNodes;

  const getAllForkedNodes = () => allForkedNodes;

  const clearAllForkedNodes = () => (allForkedNodes = {});

  const clearAllNodes = () => (
    clearOrphanNodes() && clearAllForkedNodes() && clearCheckedParents()
  );

  const logAllNodes = () => console.log('orphanNodes, allForkedNodes', orphanNodes, allForkedNodes);

  const addToCheckedParents = (parentNodeId, nodeId) => {
    const newCheckedParent = {
      id: parentNodeId,
      children: [nodeId],
    };
    if (!checkedParents[parentNodeId]) {
      checkedParents[parentNodeId] = newCheckedParent;
    } else {
      checkedParents[parentNodeId].children.push(nodeId);
    }
    // console.log('checkedParents', checkedParents);
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

        So I was counting it.  But we need to update their state if forked multiple
        times.  So let it through.
      */
    // && (parentNodeId !== lowestActiveFork || parentNodeId !== largestActiveFork);

    // basically re caching duplicate info - but this is dirty for now.
    addToCheckedParents(parentNodeId, nodeId);

    if (!isFork) {
      return false;
    }
    allForkedNodes[parentNodeId] = {
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
      && parentNodeId > largestActiveFork // || parentNodeId === prevLargestActiveFork)
      ? parentNodeId
      : largestActiveFork; // && parentNodeId > lowestActiveFork


    if (!activeForks[parentNodeId]) {
      activeForks[parentNodeId] = {
        id: parentNodeId,
        rangeEnd: nodeId
      };
    } else {
      activeForks[parentNodeId].rangeEnd = nodeId;
    }

    let prevActiveForks = Object.keys(activeForks);
    while (parentNodeId < largestActiveFork && prevActiveForks.length !== 0) {
      prevActiveForks = prevActiveForks.slice(0, prevActiveForks.length);
      const prevActiveFork = prevActiveForks.pop();
      if (parentNodeId < prevActiveFork) {
        console.log(`removing prev active fork id ${prevActiveFork}`);
        delete activeForks[prevActiveFork];
        largestActiveFork = prevActiveFork;
      }
    }


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
        const parentIsForked = checkIfFork(nodeId, parentNodeId);
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
    activeForks
  };
  // console.log('orphan cache', returnObj);
  // console.log('logAllNodes', returnObj.logAllNodes);
  // console.log('logCurrentOrphanRange', returnObj.logCurrentOrphanRange);
  window.logAllNodes = returnObj.logAllNodes;
  window.logOrphanRange = returnObj.logCurrentOrphanRange;
  return returnObj;
};
