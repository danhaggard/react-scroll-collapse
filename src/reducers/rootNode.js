import { combineReducers } from 'redux';

import {
  ADD_COLLAPSER,
  ADD_TO_NODE_TARGET_ARRAY,
  REMOVE_COLLAPSER,
  TOGGLE_CHECK_TREE_STATE,
  ADD_TO_UNMOUNT_ARRAY,
  REMOVE_FROM_UNMOUNT_ARRAY,
} from '../actions/const';

import { getOrObject } from '../utils/selectorUtils';
import {
  addToState,
  updateState,
  removeFromState
} from './utils';

export const rootNodeIdReducer = (state = null, action) => {
  const { collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapserId;
    default:
      return state;
  }
};

export const nodeTargetArrayReducer = (state = [], action) => {
  const { clearBeforeAdding, collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_TO_NODE_TARGET_ARRAY:
      if (collapserId === null) {
        return [];
      }
      // const collapserIdArr = Array.isArray(collapserId) ? collapserId : [collapserId];
      if (clearBeforeAdding) {
        // return collapserIdArr;
        return [collapserId];
      }
      // return [...state, ...collapserIdArr];
      return [...state, collapserId];

    default:
      return state;
  }
};

export const unmountArrayReducer = (state = [], action) => {
  const { collapserId, collapserIdArray } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_TO_UNMOUNT_ARRAY:
      return [...state, ...collapserIdArray];
    case REMOVE_FROM_UNMOUNT_ARRAY:
      return state.filter(id => (id !== collapserId));
    default:
      return state;
  }
};

export const checkTreeStateReducer = (state = false, action) => {
  switch (action.type) {
    case TOGGLE_CHECK_TREE_STATE:
      return !state;
    default:
      return state;
  }
};

export const rootNodeReducer = combineReducers({
  checkTreeState: checkTreeStateReducer,
  id: rootNodeIdReducer,
  nodeTargetArray: nodeTargetArrayReducer,
  unmountArray: unmountArrayReducer,
});

export const rootNodesReducer = (state = {}, action) => {
  const { collapserId, isRootNode, rootNodeId } = getOrObject(action, 'payload');
  switch (action.type) {
    case REMOVE_COLLAPSER:
      if (isRootNode) {
        return removeFromState(state, collapserId);
      }
      return state;
    case ADD_COLLAPSER:
      if (isRootNode) {
        return addToState(state, action, collapserId, rootNodeReducer);
      }
      return state;
    case ADD_TO_NODE_TARGET_ARRAY:
    case TOGGLE_CHECK_TREE_STATE:
    case ADD_TO_UNMOUNT_ARRAY:
    case REMOVE_FROM_UNMOUNT_ARRAY:
      return updateState(state, action, rootNodeId, rootNodeReducer);
    default:
      return state;
  }
};
