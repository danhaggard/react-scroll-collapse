import {
  ADD_COLLAPSER,
  ADD_ITEM,
} from '../actions/const';

import {checkAttr} from './utils';

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
  const {collapser} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_COLLAPSER:
      return [...state, collapser.id];
    default:
      return state;
  }
};

// handles the list of items nested under a collapser.
export const itemsIdArray = (state = [], action) => {
  const {item} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return [...state, item.id];
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
      return {...state, collapsers: collapsersIdArray(state.collapsers, action)};
    default:
      return state;
  }
};

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
    case ADD_ITEM:
      newState = {...state};
      // we assume we aren't adding an item to a collapser that doesn't exit.
      newState[collapserId] = collapserReducer(state[collapserId], action);
      return newState;
    default:
      return state;
  }
};
