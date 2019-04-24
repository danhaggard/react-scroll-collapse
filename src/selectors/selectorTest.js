import { createSelector } from 'reselect';
import {
  selectOrVal,
  arrSelector,
  recurseAllChildren,
  recurseAllChildrenCached,
  recurseAllChildrenLog,
  recurseAllChildrenLog2,
  recurseToNode,

} from './utils';
import { cacheSelector } from './selectorCache';
import simpleCache from './simpleCache';

/*
  -------------------------------- DONT TOUCH -----------------------------
*/
export const getReactScrollCollapser = state => selectOrVal(state, 'reactScrollCollapse');

export const getEntities = state => selectOrVal(state, 'entities');

export const getRecurseNodeTarget = state => selectOrVal(state, 'recurseNodeTarget');

export const recurseNodeTargetSelector = createSelector(
  getReactScrollCollapser,
  getRecurseNodeTarget
);

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


/*
  -------------------------------- END DONT TOUCH -----------------------------
*/


export const allChildItemsExpandedSelector = (state, props) => recurseToNode({
  cache: simpleCache,
  childSelectorFunc: collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
  currentNodeId: props.collapserId,
  evaluationFunc: arr => arr.every(a => (a === true)),
  selectorFunc: collapserId => areAllItemsExpandedSelector(state, { collapserId }),
  targetNodeId: props.targetNodeId,
});

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

export const recursivelyGetChildItems = (state, props) => recurseAllChildren(
  props.collapserId,
  state,
  props,
  collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
  (collapserId, prevReturnValue) => concatenateChildItemArraySelector(
    state,
    { collapserId, prevReturnValue }
  )
);


const allChildItemIdsSelectorFactory = () => createSelector( //eslint-disable-line
  recursivelyGetChildItems,
  val => val
);

export const allChildItemIdsSelector = cacheSelector(allChildItemIdsSelectorFactory, 'allChildItemIdsSelectorFactory', 'collapserId');
