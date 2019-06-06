import { removeFromArray } from '../utils/arrayUtils';
import { hasOwnProperty, isUndefNull } from '../utils/selectorUtils';

const createOrphanedNodeCache = (
  rootNodeId,
  treeIdSelector,
  setTreeIdFunc
) => {  // eslint-disable-line

  let CACHE = null;

  const getCache = () => CACHE;

  const setCache = newCache => (CACHE = newCache);

  const assignCache = obj => setCache({
    ...getCache(),
    ...obj,
  });

  /*
    activeForks:
      nodes currently being use to determinne ranges within which newly mounted
      nodes will be orphaned if they have any in this range as their parent.

    orphanNodes:
      Nodes that are currently registered as orphaned on mount.

    checkedParents:
      If it's in checked parents it has a child - and therefore
      using this as an additional check for forks.
      TODO: revise this - probably better to ensure treeIds
        assigned before mount so the +1 check is always reliable.
  */
  const createCacheInitObj = () => ({
    activeForks: {},
    largestActiveFork: null,
    lowestActiveFork: null,
    rangeUpperBound: null,
    orphanNodes: {},
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
  };

  /*
    If a node is not an orphan we can check if it is forking its parent.  Forked
    nodes are where orphaned children are created:

            0                     0
           /                     /
          1                     1
         /                     /
        2                     2
       /                     / \
      3                     3   4

      First tree it's safe to mount at any node.

      Second tree is forked at node 2.  Next id is 5.  If that is mounted
      under 3 - then it will be orphaned because the tree search algo will look
      for it under 4.  So we create a range between 2 - 4 not inclusive.  If there
      were more nodes already under three the range would include them as well.
      i.e. it's from the forked parent node to the last mounted id of the child
      that does the forking.
  */

  const checkIfFork = (nodeId, parentNodeId) => {
    const { activeForks, checkedParents } = getCache();
    let { lowestActiveFork, largestActiveFork, rangeUpperBound } = getCache();

    /*
      If in a mount sequence node is > + 1 parent, then it has been mounted
      higher up in the tree than the last mounted node.

      Usually means a fork except in the case where a node has been deleted
      and the next id added is higher because of that.

      TODO: make sure newly mounted nodes are getting assigned a treeId before
        being logged as forks or orphans.
    */
    const isFork = nodeId - parentNodeId > 1

      /*
        Check if a parent has a child - since you can fork what doesn't have
        at least one child.
      */
      && hasOwnProperty(checkedParents, parentNodeId);

    /*
      Dirty:  basically re caching duplicate info.  See note above about
        setting treeIds to avoid this.
    */
    addToCheckedParents(parentNodeId, nodeId);

    if (!isFork) {
      return false;
    }

    /*
      Need to know what the lowest / highest forks we've found so far.
    */
    lowestActiveFork = (lowestActiveFork === null
      || parentNodeId < lowestActiveFork) ? parentNodeId : lowestActiveFork;

    largestActiveFork = lowestActiveFork !== null
      && parentNodeId > largestActiveFork
      ? parentNodeId
      : largestActiveFork;

    /*
      Store it as an active fork - or update its end range value with
      the newest child's id.
    */
    if (!activeForks[parentNodeId]) {
      activeForks[parentNodeId] = {
        id: parentNodeId,
        rangeEnd: nodeId
      };
    } else {
      activeForks[parentNodeId].rangeEnd = nodeId;
    }

    /*
                             0
                            /
                           1
                          /
                         2
                        / \
                       3   4

        If I branch from 1 or 0 here then it won't create an orphan.
        And we would just ordinarily create a fork obj with a range from 1 ->
        the ID of the newly mounted node.

        But there will be an active fork declaring a range between 2 -> 4
        This needs to be cleaned up - since anything mounted under 1
        will be orphaned now.

        TODO: clean this logic up.
        TODO: doublt check largestActiveFork is doing any real work here.
        TODO: same with rangeUpperBound
    */
    let prevActiveForks = Object.keys(activeForks);
    while (parentNodeId < largestActiveFork && prevActiveForks.length !== 0) {
      prevActiveForks = prevActiveForks.slice(0, prevActiveForks.length);
      const prevActiveFork = prevActiveForks.pop();
      if (parentNodeId < prevActiveFork) {
        delete activeForks[prevActiveFork];
        largestActiveFork = prevActiveFork;
      }
    }

    rangeUpperBound = nodeId;

    assignCache({
      activeForks,
      checkedParents,
      lowestActiveFork,
      largestActiveFork,
      rangeUpperBound
    });

    return true;
  };


  /*
    Worst var name ever.

    Checks for orphans first - then forks.

    No point checking for forks if its an orphan since the tree
    is going to get rebuilt anyway.
  */
  const checkForkOrphan = (nodeId, parentNodeId) => {

    const nodeTreeId = treeIdSelector(nodeId);
    const parentNodeTreeId = treeIdSelector(parentNodeId);

    /*
      Don't bother if root.
    */
    if (nodeId === rootNodeId || isUndefNull(parentNodeId)) {
      return false;
    }

    const isOrphaned = checkIfOrphanedNode(parentNodeTreeId, nodeTreeId);

    if (!isOrphaned) {
      checkIfFork(nodeTreeId, parentNodeTreeId);
    }
    return isOrphaned;
  };


  /*
    Used by CollapserManager to advise of incoming collapser mounts.

    TODO: This whole bit of logic needs to be separated into another module.
  */
  const registerIncomingMount = (nodeId) => {
    const { nodesMounting } = getCache();
    nodesMounting.push(
      nodeId
    );
  };

  /*
    Called by CollapserController to register the actual mount
    now that it has happened.

    The cache can now compare the incoming mount registrations
    against the actual mount registrations to determine when
    mounting has finished.
  */
  const registerActualMount = (nodeId, parentNodeId) => {
    const { nodesMounting, nodesReadyToCheck } = getCache();
    let { currentlyMounting, nodesMountingCopy } = getCache();

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
    const { currentlyMounting } = getCache();
    let { nodesReadyToCheck, nodesMountingCopy, nodesMounting } = getCache();

    const checkedNodes = {};
    let orphaned = false;
    Object.entries(nodesReadyToCheck).forEach(([, { nodeId, parentNodeId }]) => {
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

  /*
    Called by the main cache when setting treeIds - explained over there.
    needs cleanup.
  */
  const setTreeIdWrapper = parentIdSelector => (id, val) => {
    const returnVal = setTreeIdFunc(id, val);
    const parentId = parentIdSelector(id);
    checkForkOrphan(id, parentId);
    return returnVal;
  };

  const returnObj = {
    getCache,
    setCache,
    checkIfFork,
    checkPendingNodes,
    registerActualMount,
    registerIncomingMount,
    checkIfOrphanedNode,
    checkForkOrphan,
    initCache,
    logCurrentOrphanRange,
    setTreeIdWrapper,
  };

  return returnObj;
};

export default createOrphanedNodeCache;
