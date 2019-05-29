import { combineReducers } from 'redux';

import {
  ADD_COLLAPSER,
  ADD_ITEM,
  REMOVE_ITEM,
  REMOVE_COLLAPSER,
  ADD_ACTIVE_CHILDREN,
  REMOVE_ACTIVE_CHILDREN,
  SET_ACTIVE_CHILDREN_LIMIT,
  SET_TREE_ID,
} from '../actions/const';

import { getOrObject, isUndefNull } from '../utils/selectorUtils';
import { addShiftArray, dedupeArraysByFilter } from '../utils/arrayUtils';

import {
  addToState,
  injectPayload,
  removeFromState,
  updateState,
} from './utils';


/*
  Some notes regarding state:

  collapsers.(id).collapsers = is an array of collapserIds.  Represents the
  list of collapserController components that are nested one collapser level below
  the current.  Note - in the DOM a child collapser could still be arbitrarily
  deep even if the immediate child of a particular collapser.
  Array does not include ids of children of children - i.e. only 1 level of
  depth.

  collapsers.(id).items - array of collapserItemIds.  Same principle - items
  included can't be immediate children of other collapsers - but again can be nested
  arbitrarily deep in other components in the DOM.
*/

export const activeChildrenLimitReducer = (state = Infinity, action) => {
  const { activeChildrenLimit } = getOrObject(action, 'payload');
  switch (action.type) {
    case SET_ACTIVE_CHILDREN_LIMIT:
      return activeChildrenLimit;
    default:
      return state;
  }
};

export const activeChildrenReducer = (state = [], action) => {
  const { activeChildrenToAdd, activeChildrenToRemove, activeChildrenLimit } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_ACTIVE_CHILDREN:
      return addShiftArray(state, activeChildrenToAdd, activeChildrenLimit);
    case REMOVE_ACTIVE_CHILDREN:
      return dedupeArraysByFilter(state, activeChildrenToRemove);
    case SET_ACTIVE_CHILDREN_LIMIT:
      return addShiftArray(state, [], activeChildrenLimit);
    default:
      return state;
  }
};


// handles the id attr for collapsers.
export const collapserIdReducer = (state = null, action) => {
  const { collapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapserId;
    default:
      return state;
  }
};

export const collapserTreeIdReducer = (state = null, action) => {
  const { collapserId, treeId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapserId;
    case SET_TREE_ID:
      return treeId;
    default:
      return state;
  }
};

//  handles the collapsers attr in collapsers entities.
export const collapsersIdArray = (state = [], action) => {
  const { collapserId, childCollapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return !isUndefNull(childCollapserId) ? [...state, childCollapserId] : state;
    case REMOVE_COLLAPSER:
      return state.filter(val => val !== collapserId);
    default:
      return state;
  }
};

// handles the list of immediate child items nested under a collapser.
export const itemsIdArray = (state = [], action) => {
  const { itemId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return [...state, itemId];
    case REMOVE_ITEM:
      return state.filter(val => val !== itemId);
    default:
      return state;
  }
};

export const collapserReducer = combineReducers({
  activeChildren: activeChildrenReducer,
  activeChildrenLimit: activeChildrenLimitReducer,
  collapsers: collapsersIdArray,
  id: collapserIdReducer,
  items: itemsIdArray,
  treeId: collapserTreeIdReducer,
});

/* handles reactScrollCollapse.entities.collapsers state */
export const collapsersReducer = (state = {}, action) => {
  const { collapserId, parentCollapserId } = getOrObject(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER: {
      let newState = addToState(state, action, collapserId, collapserReducer);
      if (!isUndefNull(parentCollapserId)) {
        const newAction = injectPayload(action, {
          collapserId: parentCollapserId,
          childCollapserId: collapserId
        });
        newState = updateState(newState, newAction, parentCollapserId, collapserReducer);
      }
      return newState;
    }
    case REMOVE_COLLAPSER: {
      const newState = updateState(state, action, parentCollapserId, collapserReducer);
      return removeFromState(newState, collapserId);
    }
    case ADD_ITEM:
    case REMOVE_ITEM:
    case SET_TREE_ID:
    case ADD_ACTIVE_CHILDREN:
    case REMOVE_ACTIVE_CHILDREN:
    case SET_ACTIVE_CHILDREN_LIMIT:
      return updateState(state, action, collapserId, collapserReducer);
    default:
      return state;
  }
};
