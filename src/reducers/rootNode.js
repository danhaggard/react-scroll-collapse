import { combineReducers } from 'redux';

import {
  ADD_ROOT_NODE,
  ADD_TO_NODE_TARGET_ARRAY,
  REMOVE_ROOT_NODE,
  SET_RECURSE_NODE_TARGET
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
  const { collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_TO_NODE_TARGET_ARRAY:
      if (collapserId === null) {
        return [];
      }
      return [...state, collapserId];
    default:
      return state;
  }
};

export const recurseNodeTargetReducer = (state = null, action) => {
  const { collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case SET_RECURSE_NODE_TARGET:
      return collapserId;
    default:
      return state;
  }
};

export const rootNodeReducer = combineReducers({
  id: rootNodeIdReducer,
  nodeTargetArray: nodeTargetArrayReducer,
  recurseNodeTarget: recurseNodeTargetReducer,
});

export const rootNodesReducer = (state = {}, action) => {
  const { rootNodeId } = getOrObject(action, 'payload');
  switch (action.type) {
    case REMOVE_ROOT_NODE:
      return removeFromState(state, rootNodeId);
    case ADD_ROOT_NODE:
      return addToState(state, action, rootNodeId, rootNodeReducer);
    case ADD_TO_NODE_TARGET_ARRAY:
    case SET_RECURSE_NODE_TARGET:
      return updateState(state, action, rootNodeId, rootNodeReducer);
    default:
      return state;
  }
};
