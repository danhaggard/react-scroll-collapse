import {
  ADD_ITEM,
  EXPAND_COLLAPSE,
  EXPAND_COLLAPSE_ALL,
  HEIGHT_READY,
} from '../actions/const';

import {checkAttr} from './utils';

import selectors from '../selectors';
const {getItemId, getItemExpanded} = selectors.collapserItem;

export const expandedReducer = (state = true, action) => {
  const {areAllItemsExpanded, item} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM: {
      const val = getItemExpanded(item);
      return val !== null ? val : state;
    }
    case EXPAND_COLLAPSE:
      return !state;
    case EXPAND_COLLAPSE_ALL:
      return !areAllItemsExpanded;
    default:
      return state;
  }
};

// handles 'id' attr for item entities.
export const itemIdReducer = (state = null, action) => {
  const {item} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
      return getItemId(item);
    default:
      return state;
  }
};

export const waitingForHeightReducer = (state = false, action) => {
  const {expanded, areAllItemsExpanded} = checkAttr(action, 'payload');
  switch (action.type) {
    case ADD_ITEM:
    case HEIGHT_READY:
      return false;
    case EXPAND_COLLAPSE:
      return true;
    case EXPAND_COLLAPSE_ALL:
      /*
        If the parent collapser is expanding, but this indivdual
        collapserItem is already expanded, then it is not waiting
        for the onHeightReady callback to fire - return false. Otherwise
        return true.
        note: !(!a && b) === a || !b;
      */
      return areAllItemsExpanded || !expanded;
    default:
      return state;
  }
};

// handle state for individual items.
export const itemReducer = (state = {}, action) => ({
  expanded: expandedReducer(state.expanded, action),
  id: itemIdReducer(state.id, action),
  waitingForHeight: waitingForHeightReducer(state.waitingForHeight, action),
});

// handles items state
export const itemsReducer = (state = {}, action) => {
  const {item, itemId, items} = checkAttr(action, 'payload');
  let newState;
  switch (action.type) {
    case ADD_ITEM:
      newState = {...state};
      newState[item.id] = itemReducer(undefined, action);
      return newState;
    case HEIGHT_READY:
    case EXPAND_COLLAPSE:
      newState = {...state};
      newState[itemId] = itemReducer(state[itemId], action);
      return newState;
    case EXPAND_COLLAPSE_ALL:
      newState = {...state};
      /*
        itemReducer will need to know for each item what its current expanded
        state is.  So we create a new action and insert that information.
      */
      items.forEach(id => {
        const newAction = {
          ...action,
          payload: {
            ...action.payload,
            expanded: state[id].expanded,
          },
        };
        newState[id] = itemReducer(state[id], newAction);
      });
      return newState;
    default:
      return state;
  }
};
