import { sortArrayAscending, removeFromArray } from '../utils/arrayUtils';
import { hasOwnProperty } from '../utils/selectorUtils';

const createOrphanedNodeCache = (rootNodeId, treeIdSelector, setTreeIdFunc) => {  // eslint-disable-line

  let CACHE = null;

  const clearCache = () => (CACHE = null);

  const getCache = () => CACHE;

  const setCache = newCache => (CACHE = newCache);

  const assignCache = obj => setCache({
    ...getCache(),
    ...obj,
  });

  const createCacheInitObj = () => ({
    activeForks: {},
    largestActiveFork: null,
    lowestActiveFork: null,
    rangeUpperBound: null,
    orphanNodes: {},
    allForkedNodes: {},
    checkedParents: {},
    nodesMounting: [],
    nodesReadyToCheck: [],
    nodesMountingCopy: null,
    currentlyMounting: false,
  });

  const initCache = () => {
    setCache(createCacheInitObj());
  };

  initCache();


  const checkIfOrphanedNode = (parentNodeId, nodeId) => {
    const { activeForks, lowestActiveFork, orphanNodes } = getCache();
    if (lowestActiveFork === null) {
      return false;
    }

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
      console.log('all orphan nodes: ', orphanNodes);
    }
    return isOrphan || parentIsOrphan;
  };

  const logCurrentOrphanRange = () => {
    const { activeForks } = getCache();

    const getRangeString = (start, end) => `rangeStart: ${start} - rangeEnd: ${end}.`;
    console.log('Current Active Orphan ranges are: ');
    Object.entries(activeForks).forEach(([id, fork]) => console.log(`${getRangeString(id, fork.rangeEnd)}`));
  };

  /*
  const clearCheckedParents = () => (checkedParents = {});

  const getCheckedParents = () => checkedParents;

  const clearOrphanNodes = () => (orphanNodes = {});

  const getOrphanNodes = () => orphanNodes;

  const getAllForkedNodes = () => allForkedNodes;

  const clearAllForkedNodes = () => (allForkedNodes = {});

  const clearAllNodes = () => (
    clearOrphanNodes() && clearAllForkedNodes() && clearCheckedParents()
  );
  */

  /*
  const logAllNodes = () => console.log('orphanNodes, allForkedNodes', orphanNodes, allForkedNodes);
  */


  const addToCheckedParents = (parentNodeId, nodeId) => {
    const { checkedParents } = getCache();

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
    let {
      activeForks,
      allForkedNodes,
      checkedParents,
      lowestActiveFork,
      largestActiveFork,
      rangeUpperBound
    } = getCache();


    /*
      If in a mount sequence node is > + 1 parent, then it has been mounted
      higher up in the tree than the last mounted node.  Doesn't always mean a fork
      though.
    */
    const isFork = nodeId - parentNodeId > 1
    /*
      You can't orphan a node by branching from root.

      tch tch - yes you can -
      */
    // && parentNodeId !== rootNodeId
      /*
        Check if a parent has a child - since you can fork what doesn't have
        at least one child.
      */
      && hasOwnProperty(checkedParents, parentNodeId);
      /*
        You can still fork from the points at which determine the current range
        within which parents will orphan new nodes.

        So I was counting it.  But we need to update their state if forked multiple
        times.  So let it through.
      */
    // && (parentNodeId !== lowestActiveFork || parentNodeId !== largestActiveFork);

    // basically re caching duplicate info - but this is dirty for now.
    addToCheckedParents(parentNodeId, nodeId);
    console.log('isFork - nodeId, parentNodeId', isFork, nodeId, parentNodeId);
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
    lowestActiveFork = // parentNodeId !== rootNodeId &&
      (lowestActiveFork === null
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
        // console.log(`removing prev active fork id ${prevActiveFork}`);
        delete activeForks[prevActiveFork];
        largestActiveFork = prevActiveFork;
      }
    }


    // console.log(`lowestActiveFork - after set: ${lowestActiveFork}`);
    // console.log(`largestActiveFork - after set: ${largestActiveFork}`);
    rangeUpperBound = nodeId;

    assignCache({
      activeForks,
      allForkedNodes,
      checkedParents,
      lowestActiveFork,
      largestActiveFork,
      rangeUpperBound
    });

    return true;
  };


  const checkForkOrphan = (nodeId, parentNodeId) => {

    const nodeTreeId = treeIdSelector(nodeId);
    const parentNodeTreeId = treeIdSelector(parentNodeId);
    console.log('');
    console.log('nodeId, parentNodeId', nodeId, parentNodeId);
    console.log('nodeTreeId, parentNodeTreeId', nodeTreeId, parentNodeTreeId);
    if (nodeId === rootNodeId || parentNodeId === undefined || parentNodeId === null) {
      return false;
    }
    // const isOrphaned = checkIfOrphanedNode(parentNodeId, nodeId);

    const isOrphaned = checkIfOrphanedNode(parentNodeTreeId, nodeTreeId);

    if (!isOrphaned) {
      checkIfFork(nodeTreeId, parentNodeTreeId);
    }
    return isOrphaned;
  };


  const registerIncomingMount = (nodeId) => {
    const { nodesMounting } = getCache();
    nodesMounting.push(
      nodeId
    );
  };


  const registerActualMount = (nodeId, parentNodeId) => {
    let { currentlyMounting, nodesMountingCopy, nodesMounting, nodesReadyToCheck } = getCache();

    if (!currentlyMounting) {
      nodesMountingCopy = [...nodesMounting];
      currentlyMounting = true;
    }
    const mountIdIndex = nodesMountingCopy.indexOf(nodeId);
    nodesMountingCopy = removeFromArray(nodesMountingCopy, mountIdIndex);
    if (currentlyMounting && nodesMountingCopy.length === 0) {
      currentlyMounting = false;
    }

    nodesReadyToCheck[nodeId] = {
      nodeId,
      parentNodeId,
      checked: false,
      orphaned: null
    };

    assignCache({
      currentlyMounting,
      nodesMountingCopy,
      nodesMounting,
      nodesReadyToCheck
    });

    return !currentlyMounting;
  };

  const checkPendingNodes = () => {
    let {
      currentlyMounting,
      nodesReadyToCheck,
      nodesMountingCopy,
      nodesMounting
    } = getCache();

    const checkedNodes = {};
    let orphaned = false;
    Object.entries(nodesReadyToCheck).forEach(([key, { nodeId, parentNodeId }]) => {
      orphaned = checkForkOrphan(nodeId, parentNodeId);
      checkedNodes[nodeId] = {
        nodeId,
        parentNodeId,
        checked: true,
        orphaned,
      };
    });

    nodesReadyToCheck = {};
    nodesMountingCopy = null;
    nodesMounting = [];

    assignCache({
      currentlyMounting,
      nodesReadyToCheck,
      nodesMountingCopy,
      nodesMounting
    });
    return [orphaned, checkedNodes];
  };


  const setTreeIdWrapper = parentIdSelector => (id, val) => {
    const returnVal = setTreeIdFunc(id, val);
    const parentId = parentIdSelector(id);
    checkForkOrphan(id, parentId);
    // console.log('All nodes forked', getAllForkedNodes());
    // console.log('All checked parents', getCheckedParents());
    // logCurrentOrphanRange();
    // console.log('');
    return returnVal;
  };

  const returnObj = {
    getCache,
    setCache,
    checkIfFork,
    checkPendingNodes,
    registerActualMount,
    registerIncomingMount,
    // getAllForkedNodes,
    // getCheckedParents,
    // getOrphanNodes,
    // clearOrphanNodes,
    // checkPendingNodesForOrphans,
    checkIfOrphanedNode,
    // clearAllNodes,
    checkForkOrphan,
    initCache,
    // logAllNodes,
    logCurrentOrphanRange,
    setTreeIdWrapper,
    // orphanNodes,
    // activeForks
  };
  // console.log('orphan cache', returnObj);
  // console.log('logAllNodes', returnObj.logAllNodes);
  // console.log('logCurrentOrphanRange', returnObj.logCurrentOrphanRange);
  // window.logAllNodes = returnObj.logAllNodes;
  // window.logOrphanRange = returnObj.logCurrentOrphanRange;
  return returnObj;
};

export default createOrphanedNodeCache;
