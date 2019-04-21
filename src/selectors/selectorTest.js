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
export const getReactScrollCollapser = state => selectOrVal(state, 'reactScrollCollapse');

export const getEntities = state => selectOrVal(state, 'entities');

export const entitiesSelector = createSelector(
  getReactScrollCollapser,
  getEntities
);
/*
  --- entities.collapsers:
*/
export const getCollapsers = entitiesState => arrSelector(entitiesState, 'collapsers');

export const collapsersSelectorRoot = createSelector(entitiesSelector, getCollapsers);

export const getCollapser = (collapsersState, props) => {
  if (props === undefined) {
    debugger;
  }
  return collapsersState[props.collapserId];
};
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


const getAreAllItemsExpanded = itemsObj => Object.values(itemsObj).every(
  item => getItemExpanded(item)
);

// (rootState, { collapserId }) => true/false
const areAllItemsExpandedSelectorFactory = () => createSelector(
  itemObjSelectorRoot,
  getAreAllItemsExpanded
);

export const areAllItemsExpandedSelector = cacheSelector(areAllItemsExpandedSelectorFactory, 'collapserId');


// (rootState, { collapserId }) => [should break recursion loop?, value to return if it does break]
export const everyChildItemExpandedConditionSelectorFactory = () => createSelector(
  areAllItemsExpandedSelector,
  areAllItemsExpanded => [!areAllItemsExpanded, areAllItemsExpanded]
);

export const everyChildItemExpandedConditionSelector = cacheSelector(everyChildItemExpandedConditionSelectorFactory, 'collapserId');

/*
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
*/

const areAllChildItemsExpandedFactory = () => createSelector( //eslint-disable-line
  (state, props) => ({ state, props }),
  ({ state, props }) => recurseAllChildren(
    props.collapserId,
    state,
    props,
    collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
    collapserId => everyChildItemExpandedConditionSelector(state, { collapserId })
  )
);

export const areAllChildItemsExpanded = cacheSelector(areAllChildItemsExpandedFactory, 'collapserId');


/*
  -------------------------------- END DONT TOUCH -----------------------------
*/

// (rootState, { collapserId }) => { collapserId : []}
export const childItemIdArraySelectorFactory = () => createSelector(
  [itemObjSelectorRoot, (_, { collapserId }) => collapserId],
  (itemObj, collapserId) => ([collapserId, Object.keys(itemObj)])
);

export const childItemIdArraySelector = cacheSelector(childItemIdArraySelectorFactory, 'collapserId');


// (rootState, { collapserId }) => [run till end, concatenate prev values]
export const concatenateChildItemArraySelectorFactory = () => createSelector(
  [childItemIdArraySelector, (_, props) => props],
  (childItemIdArray, props) => {
    const { prevReturnValue } = props;
    if (!prevReturnValue) {
      return [false, [childItemIdArray]];
    }
    if (childItemIdArray[0] === undefined) {
      return [false, prevReturnValue];
    }
    return [false, [...prevReturnValue, childItemIdArray]];
  }
);

export const concatenateChildItemArraySelector = cacheSelector(concatenateChildItemArraySelectorFactory, 'collapserId');

const allChildItemIdsSelectorFactory = () => createSelector( //eslint-disable-line
  (state, props) => ({ state, props }),
  ({ state, props }) => recurseAllChildren(
    props.collapserId,
    state,
    props,
    collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
    (collapserId, prevReturnValue) => concatenateChildItemArraySelector(
      state,
      { collapserId, prevReturnValue }
    )
  )
);

export const allChildItemIdsSelector = cacheSelector(allChildItemIdsSelectorFactory, 'collapserId');

/*

// (rootState, { collapserId }) => [should break recursion loop?, value to return if it does break]
export const everyChildItemExpandedConditionSelectorFactory = () => createSelector(
  areAllItemsExpandedSelector,
  areAllItemsExpanded => [!areAllItemsExpanded, areAllItemsExpanded]
);

// (rootState, { collapserId }) => itemsObj
export const itemObjSelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => itemsObjSelector(collapsersState, props)
);
*/

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
