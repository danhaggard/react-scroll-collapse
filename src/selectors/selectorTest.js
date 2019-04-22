import { createSelector } from 'reselect';
import {
  selectOrVal,
  arrSelector,
  recurseAllChildren,
} from './utils';
import { cacheSelector } from './selectorCache';
import logPerformance from '../utils/logPerformance';


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

export const getCollapser = (collapsersState, props) => collapsersState[props.collapserId];

// (collapsersState, { collapserId }) => collapser
export const collapserSelectorFactory = () => createSelector(
  getCollapser, collapser => collapser
);

export const collapserSelector = cacheSelector(collapserSelectorFactory, 'collapserSelectorFactory', 'collapserId');


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
export const childCollapsersArraySelectorFactory = () => createSelector(
  collapserSelector,
  getChildCollapsersArray
);

export const childCollapsersArraySelector = cacheSelector(childCollapsersArraySelectorFactory, 'childCollapsersArraySelectorFactory', 'collapserId');


// rootState, { collapserId }) => childCollapsersArray
export const childCollapserArraySelectorRootFactory = () => createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => childCollapsersArraySelector(collapsersState, props)
);
export const childCollapserArraySelectorRoot = cacheSelector(childCollapserArraySelectorRootFactory, 'childCollapserArraySelectorRootFactory', 'collapserId');


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
  --- collapser.areAllItemsExpanded
*/
export const getAreAllItemsExpandedState = collapserObj => selectOrVal(collapserObj, 'allChildItemsExpanded');


// (collapsersState, { collapserId }) => areAllItemsExpanded
export const areAllItemsExpandedStateSelectorFactory = () => createSelector(
  collapserSelector,
  getAreAllItemsExpandedState
);
export const areAllItemsExpandedStateSelector = cacheSelector(
  areAllItemsExpandedStateSelectorFactory,
  'areAllItemsExpandedStateSelectorFactory',
  'collapserId'
);

// (rootState, { collapserId }) => areAllItemsExpanded
export const areAllItemsExpandedStateSelectorRootFactory = () => createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => areAllItemsExpandedStateSelector(collapsersState, props)
);

export const areAllItemsExpandedStateSelectorRoot = cacheSelector(
  areAllItemsExpandedStateSelectorRootFactory,
  'areAllItemsExpandedStateSelectorRootFactory',
  'collapserId'
);



/*
  --- collapser.areAllItemsExpanded
*/
export const getNotifiedByChild = collapserObj => selectOrVal(collapserObj, 'notifiedByChild');


// (collapsersState, { collapserId }) => areAllItemsExpanded
export const notifiedByChildSelectorFactory = () => createSelector(
  collapserSelector,
  getNotifiedByChild
);
export const notifiedByChildSelector = cacheSelector(
  notifiedByChildSelectorFactory,
  'notifiedByChildSelectorFactory',
  'collapserId'
);

// (rootState, { collapserId }) => areAllItemsExpanded
export const notifiedByChildSelectorRootFactory = () => createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => notifiedByChildSelector(collapsersState, props)
);

export const notifiedByChildSelectorSelectorRoot = cacheSelector(
  notifiedByChildSelectorRootFactory,
  'notifiedByChildSelectorRootFactory',
  'collapserId'
);




/*
  --- collapser.itemsObj
*/
export const getItemsObj = collapserObj => arrSelector(collapserObj, 'itemsObj');

// (collapsersState, { collapserId }) => itemsObj
export const itemsObjSelectorFactory = () => createSelector(collapserSelector, getItemsObj);
export const itemsObjSelector = cacheSelector(itemsObjSelectorFactory, 'itemsObjSelectorFactory', 'collapserId');


// (rootState, { collapserId }) => itemsObj
export const itemObjSelectorRootFactory = () => createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => itemsObjSelector(collapsersState, props)
);

export const itemObjSelectorRoot = cacheSelector(itemObjSelectorRootFactory, 'itemObjSelectorRootFactory', 'collapserId');


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
function areAllItemsExpandedSelectorFactory() {
  return createSelector(
    itemObjSelectorRoot,
    getAreAllItemsExpanded
  );
}

export const areAllItemsExpandedSelector = cacheSelector(areAllItemsExpandedSelectorFactory, 'areAllItemsExpandedSelectorFactory', 'collapserId');


// (rootState, { collapserId }) => [should break recursion loop?, value to return if it does break]
export const everyChildItemExpandedConditionSelectorFactory = () => createSelector(
  areAllItemsExpandedSelector,
  areAllItemsExpanded => [!areAllItemsExpanded, areAllItemsExpanded]
);

export const everyChildItemExpandedConditionSelector = cacheSelector(everyChildItemExpandedConditionSelectorFactory, 'everyChildItemExpandedConditionSelectorFactory', 'collapserId');

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

export const areAllChildItemsExpanded = cacheSelector(areAllChildItemsExpandedFactory, 'areAllChildItemsExpandedFactory', 'collapserId');


/*
  -------------------------------- END DONT TOUCH -----------------------------
*/

// (rootState, { collapserId }) => { collapserId : []}
export const childItemIdArraySelectorFactory = () => createSelector(
  [itemObjSelectorRoot, (_, { collapserId }) => collapserId],
  (itemObj, collapserId) => ([collapserId, Object.keys(itemObj)])
);

export const childItemIdArraySelector = cacheSelector(childItemIdArraySelectorFactory, 'childItemIdArraySelectorFactory', 'collapserId');


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

export const concatenateChildItemArraySelector = cacheSelector(concatenateChildItemArraySelectorFactory, 'concatenateChildItemArraySelectorFactory', 'collapserId');

export const recursivelyGetChildItems = ({ state, props }) => recurseAllChildren(
  props.collapserId,
  state,
  props,
  collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
  (collapserId, prevReturnValue) => concatenateChildItemArraySelector(
    state,
    { collapserId, prevReturnValue }
  )
);

//export const recursivelyGetChildItems = logPerformance(recursively_GetChildItems, 'recursivelyGetChildItems');


const allChildItemIdsSelectorFactory = () => createSelector( //eslint-disable-line
  (state, props) => ({ state, props }),
  recursivelyGetChildItems
);

export const allChildItemIdsSelector = cacheSelector(allChildItemIdsSelectorFactory, 'allChildItemIdsSelectorFactory', 'collapserId');

//export const allChildItemIdsSelectorA = cacheSelector(allChildItemIdsSelectorFactory, 'allChildItemIdsSelectorFactory', 'collapserId');


//export const allChildItemIdsSelector = logPerformance(allChildItemIdsSelectorA, 'allChildItemIdsSelector');

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
