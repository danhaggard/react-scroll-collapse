import { getOrNull, compose, curryCompose } from '../utils/selectorUtils';
import { getEntitiesRoot } from './common';

const getRootNodes = entitiesObject => getOrNull(entitiesObject, 'rootNodes');

// rootState => rootNodesObject
const getRootNodesRoot = compose(getRootNodes, getEntitiesRoot);

const getRootNode = rootNodesObject => id => getOrNull(rootNodesObject, id);


// rootState => id => rootNodeObject
export const getRootNodeRoot = compose(getRootNode, getRootNodesRoot);


// --- rootNode.recurseNodeTarget
export const getRootNodeRecurseNodeTarget = rootNodeObject => getOrNull(
  rootNodeObject,
  'recurseNodeTarget'
);

// rootState => id = true / false
export const getRootNodeRecurseNodeTargetRoot = curryCompose(
  getRootNodeRecurseNodeTarget,
  getRootNodeRoot
);
