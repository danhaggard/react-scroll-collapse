/*
  Needs refactor to match reselect docs.  This approach doesn't memoize properly and
  makes it hard to see what the inputs and outputs of each function are.

  Any function ending with 'selector' - takes top level redux state as it's
  argument.  For use in mapStateToProps etc.

  Anything starting with 'get' takes bits of state one level higher than returned.
*/

import {createSelector} from 'reselect';
import {
  selector,
  arrSelector,
  entitiesSelector,
  getAllNested,
  selectFunc,
} from './utils';
import {itemSelector, itemExpandedSelector, itemWaitingForHeightSelector} from './collapserItem';
import {getNextIdFromObj} from '../reducers/utils';


export const getCollapsers = entities => selector(entities, 'collapsers');

export const getChildCollapsers = collapser => arrSelector(collapser, 'collapsers');

export const getChildItems = collapser => arrSelector(collapser, 'items');

export const getAllNestedCollapsers = childCollapsersSelectorFunc => collapserId =>
  getAllNested(collapserId, childCollapsersSelectorFunc);

export const selectCollapserFunc = collapsers => collapserId => selector(collapsers, collapserId);

// state => scrollerCollapser.entities.collapsers
export const collapsersSelector = createSelector(entitiesSelector, getCollapsers);

// state => id => scrollerCollapser.entities.collapsers[id]
export const collapserSelector = createSelector(collapsersSelector, selectCollapserFunc);

export const nextCollapserIdSelector = createSelector(
  collapsersSelector, collapsers => getNextIdFromObj(collapsers)
);

// state => id => scrollerCollapser.entities.collapsers[id].collapsers
export const childCollapsersSelector = createSelector(
  collapserSelector, selectFunc(getChildCollapsers)
);

// state => id => { all nested collapsers of scrollerCollapser.entities.collapsers[id] }
export const allNestedCollapsersSelector = createSelector(
  childCollapsersSelector, getAllNestedCollapsers);

  // state => id => scrollerCollapser.entities.collapsers[id].items
export const childItemsSelector = createSelector(
  collapserSelector, selectFunc(getChildItems)
);

/*
  a reminder note about how createSelector works - with
  respect to allChildItemsIdSelector as example.

  It is taking two arguments.  The first arg is:
    [allNestedCollapsersSelector, childItemsSelector]
  both the selectors in that array take redux state as a single
  argument (they should also be able to take props as well but i need to
  implement that yet.) - and in this case - they both return another function
  which takes a collapserId as it's single argument.

  these two return functions become the input for the second argument of createSelector.
  which is another function.
  i.e. the return funcs get passed to:  (getAllNestedFromId, getAllItemsFromId).

  and  this second argument of createSelector returns the func starting with:
    (getAllNestedFromId, getAllItemsFromId) =>

  And this func is also a func that takes collapserId as it's arg.
*/

// state => id => { all nested item ids of scrollerCollapser.entities.collapsers[id] }
export const allChildItemsIdSelector = createSelector(
  [allNestedCollapsersSelector, childItemsSelector],
  (getAllNestedFromId, getAllItemsFromId) => collapserId => {
    const allNested = getAllNestedFromId(collapserId);
    return getAllItemsFromId(collapserId).concat(
      ...allNested.map(id => getAllItemsFromId(id)));
  }
);

export const allChildItemsSelector = createSelector(
  [allChildItemsIdSelector, itemSelector],
  (getAllChildItemsFromId, getItemFromId) => collapserId => {
    const allChildItemIds = getAllChildItemsFromId(collapserId);
    return allChildItemIds.map(itemId => getItemFromId(itemId));
  }
);

/*
   takes collapserId as input - returns an array of
   item.expanded truth values corresponding to all the nested
   itemIds of the collapser.
*/
export const itemExpandedArrSelector = createSelector(
  [allChildItemsIdSelector, itemExpandedSelector],
  (getAllChildItemsFromId, getItemExpandedFromId) => collapserId => {
    const allChildItemIds = getAllChildItemsFromId(collapserId);
    return allChildItemIds.map(itemId => getItemExpandedFromId(itemId));
  }
);

export const itemWaitingForHeightArrSelector = createSelector(
  [allChildItemsIdSelector, itemWaitingForHeightSelector],
  (getAllChildItemsFromId, getItemWaitingForHeightFromId) => collapserId => {
    const allChildItemIds = getAllChildItemsFromId(collapserId);
    return allChildItemIds.map(itemId => getItemWaitingForHeightFromId(itemId));
  }
);

export const areAllItemsExpandedSelector = createSelector(
  itemExpandedArrSelector, itemExpandedArr => collapserId => {
    const expandedArr = itemExpandedArr(collapserId).filter(expanded => expanded === false);
    // if some false, then not all expanded - otherwise all expanded.
    return !(expandedArr.length > 0);
  }
);

export const haveAllItemsReportedHeightSelector = createSelector(
  itemWaitingForHeightArrSelector, itemWaitingForHeightArr => collapserId => {
    const waitingForHeightArr = itemWaitingForHeightArr(collapserId).filter(
      waiting => waiting === true);
    // if there are true vals - then an item is still waiting.
    return !(waitingForHeightArr.length > 0);
  }
);
