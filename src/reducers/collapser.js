import {
  ADD_COLLAPSER,
  ADD_ITEM,
  REMOVE_ITEM,
  REMOVE_COLLAPSER,
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
    case ADD_COLLAPSER:
      return [...state, collapser.id];
    case REMOVE_COLLAPSER:
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

export const collapserReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_COLLAPSER:
      return ({
        // if I call collapsersIdArray here then I have to write  logic checking
        // whether it is a parentCollapser calling it or a child collapser.
        collapsers: [],
        id: collapserIdReducer(state.id, action),
        // same as with collapsers.
        items: [],
      });
    case ADD_ITEM:
    case REMOVE_ITEM:
      // item is included in the item array for the parent collapser.
      return {...state, items: itemsIdArray(state.items, action)};
    default:
      return state;
  }
};

/*
  updates the list of collapsers nested under a collapser.
  bad pattern?  we no longer have a single reducer handling this
  part of state.  But it was far messier to handle this all in
  collapserReducer.
*/
export const parentCollapserReducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_COLLAPSER:
    case REMOVE_COLLAPSER:
      return {...state, collapsers: collapsersIdArray(state.collapsers, action)};
    default:
      return state;
  }
};

/* handles reactScrollCollapse.entities.collapsers state */
export const collapsersReducer = (state = {}, action) => {
  const {collapser, collapserId, parentCollapserId} = checkAttr(action, 'payload');
  let newState;
  switch (action.type) {
    case ADD_COLLAPSER:
      newState = {...state};
      if (parentCollapserId >= 0) {
        // then this collapser is nested under another collapser and we make sure
        // that the id of the new collapser is added to its list.
        newState[parentCollapserId] = parentCollapserReducer(state[parentCollapserId], action);
      }
      // now we add this new collapser to the total set in entities.
      newState[collapser.id] = collapserReducer(undefined, action);
      return newState;
    case REMOVE_COLLAPSER:
      newState = {...state};
      if (parentCollapserId >= 0 && parentCollapserId in state) {
        /*
          if parentCollapserId >= 0 then this collapser is nested under
          another collapser so we remove its id from the parents list of children.

          However the parent may already have been removed by the middleware
        */
        newState[parentCollapserId] = parentCollapserReducer(state[parentCollapserId], action);
      }
      delete newState[collapserId];
      return newState;
    case ADD_ITEM:
    case REMOVE_ITEM:
      /*
        collapser may have already been removed - so we check that it exists,
        otherwise we will re-add it's id back into state.
      */
      if (collapserId in state) {
        newState = {...state};
        newState[collapserId] = collapserReducer(state[collapserId], action);
        return newState;
      }
      return state;

    default:
      return state;
  }
};
