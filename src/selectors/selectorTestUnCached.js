import { createSelector } from 'reselect';
import {
  selectOrVal,
  arrSelector,
  recurseAllChildren,
} from './utils';
import { cacheSelector } from './selectorCache';


/*
  -------------------------------- DONT TOUCH -----------------------------
*/
export const getEntities = state => selectOrVal(state, 'entities');


/*
  --- entities.collapsers:
*/
export const getCollapsers = entitiesState => arrSelector(entitiesState, 'collapsers');

export const collapsersSelectorRoot = createSelector(getEntities, getCollapsers);

export const getCollapser = (collapsersState, { collapserId }) => collapsersState[collapserId];

// (collapsersState, { collapserId }) => collapser
export const collapserSelector = createSelector(
  getCollapser, collapser => collapser
);

// (rootState, { collapserId }) => collapser
export const collapserSelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => collapserSelector(collapsersState, props)
);


/*
  --- collapser.collapsers:
*/
export const getChildCollapsersArray = collapserObj => arrSelector(collapserObj, 'collapsers');

// (collapsersState, { collapserId }) => childCollapsersArray
export const childCollapsersArraySelector = createSelector(
  collapserSelector,
  getChildCollapsersArray
);

// rootState, { collapserId }) => childCollapsersArray
export const childCollapserArraySelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => childCollapsersArraySelector(collapsersState, props)
);


/*
  --- collapser.items:
*/
export const getChildItemsArray = collapserObj => arrSelector(collapserObj, 'items');

// (collapsersState, { collapserId }) => childItemsArray
export const childItemsArraySelector = createSelector(collapserSelector, getChildItemsArray);

// (rootState, { collapserId }) => childItemsArray
export const childItemArraySelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => childItemsArraySelector(collapsersState, props)
);

/*
  --- collapser.itemsObj
*/
export const getItemsObj = collapserObj => arrSelector(collapserObj, 'itemsObj');

// (collapsersState, { collapserId }) => itemsObj
export const itemsObjSelector = createSelector(collapserSelector, getItemsObj);


// (rootState, { collapserId }) => itemsObj
export const itemObjSelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => itemsObjSelector(collapsersState, props)
);


export const getItem = (itemsState, { itemId }) => itemsState[itemId];

// (itemsObjState, { itemId }) => item
export const itemSelector = createSelector(
  getItem, item => item,
);

// (collapsersState, { collapserId, itemId }) => itemObj
export const itemFromCollapserSelector = createSelector(
  itemsObjSelector, itemSelector
);

// (rootState, { collapserId, itemId }) => itemObj
export const itemFromCollapserSelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => itemFromCollapserSelector(collapsersState, props)
);

/*
  --- item.expanded
*/
export const getItemExpanded = itemObj => selectOrVal(itemObj, 'expanded');

// (itemsObjState, { itemId }) => item.expanded
export const itemExpandedSelector = createSelector(itemSelector, getItemExpanded);

// (rootState, { itemId }) => childItemsArray
export const itemExpandedSelectorRoot = createSelector(
  [itemFromCollapserSelectorRoot, (_, props) => props],
  (itemObjState, props) => itemExpandedSelector(itemObjState, props)
);


/*
  FILTER SELECTORS
*/


const getAreAllItemsExpanded = itemsObj => Object.values(itemsObj).every(item => getItemExpanded(item));

// (rootState, { collapserId }) => true/false
const areAllItemsExpandedSelector = createSelector(
  itemObjSelectorRoot,
  getAreAllItemsExpanded
);

// (rootState, { collapserId }) => [should break recursion loop?, value to return if it does break]

export const everyChildItemExpandedConditionSelector = createSelector(
  areAllItemsExpandedSelector,
  areAllItemsExpanded => [!areAllItemsExpanded, areAllItemsExpanded]
);

/*
  -------------------------------- END DONT TOUCH -----------------------------
*/


const areAllChildItemsExpandedFactory = () => createSelector( //eslint-disable-line
  (state, props) => ({ state, props }),
  ({ state, props }) => {
    const selectorFunc = collapserId => childCollapserArraySelectorRoot(state, { collapserId });
    const breakCondition = collapserId => everyChildItemExpandedConditionSelector(
      state,
      { collapserId }
    );
    return recurseAllChildren(state, props.collapserId, selectorFunc, breakCondition);
  }
);

export const areAllChildItemsExpanded = cacheSelector(areAllChildItemsExpandedFactory, 'collapserId');



/*
  --- entities.items:

export const getItems = entitiesState => arrSelector(entitiesState, 'items');

export const itemsSelectorRoot = createSelector(getEntities, getItems);

export const getItem = (itemsState, { itemId }) => itemsState[itemId];

// (itemsState, { itemId }) => item
export const itemSelector = createSelector(
  getItem, item => item,
);

// (rootState, { itemId }) => item
export const itemSelectorRoot = createSelector(
  [itemsSelectorRoot, (_, props) => props],
  (itemsState, props) => itemSelector(itemsState, props)
);
*/

/*
  --- item.expanded

export const getItemExpanded = itemObj => selectOrVal(itemObj, 'expanded');

// (itemsState, { itemId }) => item.expanded
export const itemExpandedSelector = createSelector(itemSelector, getItemExpanded);

// (rootState, { itemId }) => childItemsArray
export const itemExpandedSelectorRoot = createSelector(
  [itemsSelectorRoot, (_, props) => props],
  (itemsState, props) => itemExpandedSelector(itemsState, props)
);
*/
