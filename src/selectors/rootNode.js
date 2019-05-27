import { getOrArray, getOrNull, compose, curryCompose } from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';

const getRootNodes = entitiesObject => getOrNull(entitiesObject, 'rootNodes');

// rootState => rootNodesObject
const getRootNodesRoot = compose(getRootNodes, getEntitiesRoot);

const getRootNode = rootNodesObject => id => getOrNull(rootNodesObject, id);


// rootState => id => rootNodeObject
export const getRootNodeRoot = compose(getRootNode, getRootNodesRoot);

// --- rootNode.nodeTargetArray
export const getRootNodeTargetArray = rootNodeObject => getOrArray(
  rootNodeObject,
  'nodeTargetArray'
);

// rootState => id = [3, 4, etc...]
export const getNodeTargetArrayRoot = curryCompose(
  getRootNodeTargetArray,
  getRootNodeRoot
);


// --- rootNode.checkTreeState
export const getRootNodeCheckTreeState = rootNodeObject => getOrNull(
  rootNodeObject,
  'checkTreeState'
);

// rootState => id => bool
export const getCheckTreeStateRoot = curryCompose(
  getRootNodeCheckTreeState,
  getRootNodeRoot
);


// --- rootNode.nodeTargetArray
export const getRootUnmountArray = rootNodeObject => getOrNull(
  rootNodeObject,
  'unmountArray'
);

// rootState => id = [3, 4, etc...]
export const getRootUnmountArrayRoot = curryCompose(
  getRootUnmountArray,
  getRootNodeRoot
);
