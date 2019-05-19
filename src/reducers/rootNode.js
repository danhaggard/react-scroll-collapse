import { combineReducers } from 'redux';

import {
  ADD_ROOT_NODE,
  ADD_TO_NODE_TARGET_ARRAY,
  REMOVE_ROOT_NODE,
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

export const rootNodeReducer = combineReducers({
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
      return updateState(state, action, rootNodeId, rootNodeReducer);
    default:
      return state;
  }
};
