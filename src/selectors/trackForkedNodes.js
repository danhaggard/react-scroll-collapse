export const createForkedNodesTracker = (rootNodeId) => {  // eslint-disable-line
  let largestActiveFork = null;  // literally the last one found.
  let lowestActiveFork = null;
  let rangeUpperBound = null;

  let orphanNodes = {};
  let forkedNodes = {};

  const checkIfOrphanedNode = (id) => {
    if (lowestActiveFork === null) {
      return false;
    }
    if (id === lowestActiveFork || id === largestActiveFork) {
      return false;
    }

    if (lowestActiveFork < id && id < rangeUpperBound) {
      const orphanNodeObj = {
        nodeId: id,
        rangeStart: lowestActiveFork,
        rangeEnd: rangeUpperBound
      };

      orphanNodes[id] = orphanNodeObj;
      console.log(`nodeId ${id} is damned because`, orphanNodeObj);
      return true;
    }


    return (lowestActiveFork < id && id < rangeUpperBound);
  };


  const logCurrentOrphanRange = () => {
    const message = `rangeStart: ${lowestActiveFork} - rangeEnd: ${rangeUpperBound}.`;
    console.log(message);

    if (lowestActiveFork < largestActiveFork && largestActiveFork < rangeUpperBound) {
      const message2 = `Note that the largestActiveFork: ${largestActiveFork} is currently within this range and is excluded.  You can mount there!`;
      console.log(message2);
    }
  };

  const clearOrphanNodes = () => (orphanNodes = {});

  const getOrphanNodes = () => orphanNodes;

  const getForkedNodes = () => forkedNodes;

  const clearForkedNodes = () => (forkedNodes = {});

  const clearAllNodes = () => (clearOrphanNodes() && clearForkedNodes());

  const logAllNodes = () => console.log('orphanNodes, forkedNodes', orphanNodes, forkedNodes);

  const checkIfFork = (nodeId, parentNodeId) => {

    const isFork = nodeId - parentNodeId > 1 && parentNodeId !== rootNodeId;
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
    //console.log(`lowestActiveFork - before set: ${lowestActiveFork}`);
    //console.log(`largestActiveFork - before set: ${largestActiveFork}`);
    lowestActiveFork = parentNodeId !== rootNodeId
      && (lowestActiveFork === null
        || parentNodeId < lowestActiveFork) ? parentNodeId : lowestActiveFork;

    largestActiveFork = lowestActiveFork !== null
      && parentNodeId > largestActiveFork ? parentNodeId : largestActiveFork; // && parentNodeId > lowestActiveFork

      //console.log(`lowestActiveFork - after set: ${lowestActiveFork}`);
      //console.log(`largestActiveFork - after set: ${largestActiveFork}`);
    rangeUpperBound = nodeId;
    return true;
  };

  const checkForkOrphan = (nodeId, parentNodeId) => {
    if (nodeId !== rootNodeId) {
      const isOrphaned = checkIfOrphanedNode(parentNodeId);
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
  console.log('orphan cache', returnObj);
  console.log('logAllNodes', returnObj.logAllNodes);
  console.log('logCurrentOrphanRange', returnObj.logCurrentOrphanRange);

  return returnObj;
};
