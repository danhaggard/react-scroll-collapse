import {combineReducers} from 'redux';

import {
  ADD_COLLAPSER,
  ADD_COLLAPSER_CHILD,
  ADD_ITEM,
  REMOVE_ITEM,
  REMOVE_COLLAPSER,
  REMOVE_COLLAPSER_CHILD
} from '../actions/const';

import {checkAttr} from './utils';

/*
  State shape
  ===========
  reactScrollCollapse.entities = {
    ...entities,  -- (other reducers)
    collapsers: {
      0: {
        collapsers: [array of collapserIds],
        id: 0 (matches key)
        items: [array of collapserItemIds]
      },
      ... and so on.
    }
  }

  Some notes regarding state:

  collapsers.(id).collapsers = is an array of collapserIds.  Represents the
  list of elemets wrapped with collapserController  - who comprise the first
  level of nested collapserController children.  i.e. they are the first collapsers
  encountered nested within the current collapser (they don't have to be the immediate
  children in the dom).  Array does not include ids of children of children.

  collapsers.(id).items - array of collapserItemIds.  Same principle - items
  included can't be direct children on other collapsers - but again can be nested
  arbitrarily deep in other components.
*/


// handles the id attr for collapsers.
export const collapserIdReducer = (state = null, action) => {
  const {collapser} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return collapser.id;
    default:
      return state;
  }
};

//  handles the collapsers attr in collapsers entities.
export const collapsersIdArray = (state = [], action) => {
  const {collapser, collapserId} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER_CHILD:
      return [...state, collapser.id];
    case REMOVE_COLLAPSER_CHILD:
      return state.filter(val => val !== collapserId);
    default:
      return state;
  }
};

// handles the list of immediate child items nested under a collapser.
export const itemsIdArray = (state = [], action) => {
  const {item, itemId} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return [...state, item.id];
    case REMOVE_ITEM:
      return state.filter(val => val !== itemId);
    default:
      return state;
  }
};

export const collapserReducer = combineReducers({
  collapsers: collapsersIdArray,
  id: collapserIdReducer,
  items: itemsIdArray,
});

/* handles reactScrollCollapse.entities.collapsers state */
export const collapsersReducer = (state = {}, action) => {
  const {collapser, collapserId, parentCollapserId} = checkAttr(action, 'payload');
  let newState;
  switch (action.type) {
    case ADD_COLLAPSER:
      newState = {...state};
      newState[collapser.id] = collapserReducer(undefined, action);
      return newState;
    case ADD_COLLAPSER_CHILD:
    case REMOVE_COLLAPSER_CHILD:
      newState = {...state};
      if (state[parentCollapserId]) {
        newState[parentCollapserId] = collapserReducer(state[parentCollapserId], action);
      }
      return newState;
    case REMOVE_COLLAPSER:
      newState = {...state};
      delete newState[collapserId];
      return newState;
    case ADD_ITEM:
    case REMOVE_ITEM:
      newState = {...state};
      if (collapserId in state) {
        newState[collapserId] = collapserReducer(state[collapserId], action);
      }
      return newState;
    default:
      return state;
  }
};
