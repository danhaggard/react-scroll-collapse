import { REMOVE_COLLAPSER } from '../actions/const';
import { removeCollapser, removeItem } from '../actions';
import {checkAttr} from './../reducers/utils';

import selectors from './../selectors';
const {childCollapsersSelector, childItemsSelector} = selectors.collapser;


export const reactScrollCollapseMiddleWare = store => next => action => {
  if (action.type !== REMOVE_COLLAPSER) {
    return next(action);
  }
  const state = store.getState();
  const {collapserId} = checkAttr(action, 'payload');
  const childCollapsers = childCollapsersSelector(state)(collapserId);
  const childItems = childItemsSelector(state)(collapserId);

  console.log('In middleware removing: collapserId, childCollapsers, childItems',
    collapserId, childCollapsers, childItems);

  for (const itemId of childItems) {
    store.dispatch(removeItem(collapserId, itemId));
  }

  for (const childCollapserId of childCollapsers) {
    /*
      args for removeCollapser = (parentCollapserId, scrollerId, collapserId)
      immediate child of this collapser can't be immediate child of a scroller
      so scrollerId: undefined.  This collapserId passed in the action must be
      the parent of the child - so that instantiates the parentCollapserId arg.
    */
    store.dispatch(removeCollapser(collapserId, undefined, childCollapserId));
  }
  return next(action);
};
