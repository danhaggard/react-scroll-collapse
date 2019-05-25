import { combineReducers } from 'redux';

import {
  ADD_ROOT_NODE,
  ADD_TO_NODE_TARGET_ARRAY,
  EXPAND_COLLAPSE_ALL,
  EXPAND_COLLAPSE,
  REMOVE_ROOT_NODE,
  TOGGLE_CHECK_TREE_STATE
} from '../actions/const';
import { getOrObject } from '../utils/selectorUtils';
import {
  addToState,
  updateState,
  removeFromState
} from './utils';

export const rootNodeIdReducer = (state = null, action) => {
  const { rootNodeId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_ROOT_NODE:
      return rootNodeId;
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
      if (clearBeforeAdding) {
        return [collapserId];
      }
      return [...state, collapserId];
    default:
      return state;
  }
};

export const checkTreeStateReducer = (state = false, action) => {
  switch (action.type) {
    case EXPAND_COLLAPSE_ALL:
    case EXPAND_COLLAPSE:
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
});

export const rootNodesReducer = (state = {}, action) => {
  const { rootNodeId } = getOrObject(action, 'payload');
  switch (action.type) {
    case REMOVE_ROOT_NODE:
      return removeFromState(state, rootNodeId);
    case ADD_ROOT_NODE:
      return addToState(state, action, rootNodeId, rootNodeReducer);
    case ADD_TO_NODE_TARGET_ARRAY:
    case EXPAND_COLLAPSE_ALL:
    case EXPAND_COLLAPSE:
    case TOGGLE_CHECK_TREE_STATE:
      return updateState(state, action, rootNodeId, rootNodeReducer);
    default:
      return state;
  }
};
