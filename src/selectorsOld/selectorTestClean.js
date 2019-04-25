import { createSelector } from 'reselect';
import {
  selectOrVal,
  arrSelector,
  recurseAllChildren
} from './utils';
import recurseToNode from './recurseToNode';
import { cacheSelector } from './selectorCache';
import simpleCache from './simpleCache';


/*
  -------------------------------- TIER ZERO -----------------------------
  reactScrollCollapse
*/

const getReactScrollCollapse = state => selectOrVal(state, 'reactScrollCollapse');

/*
  -------------------------------- TIER ONE -----------------------------
  entities
  recurseNodeTarget
  scrollers ??
*/


const getEntities = state => selectOrVal(state, 'entities');

const getRecurseNodeTarget = state => selectOrVal(state, 'recurseNodeTarget');

// const getScrollers = state => selectOrVal(state, 'scrollers');

/*
  -------------------------------- TIER TWO (entities)-----------------------------
  scrollers
  items
  collapsers
*/
const getCollapsers = entitiesState => arrSelector(entitiesState, 'collapsers');

const getCollapser = (collapsersState, props) => collapsersState[props.collapserId];



/*
  -------------------------------- TOUCH -----------------------------
*/

const recurseNodeTargetSelector = createSelector(
  getReactScrollCollapse,
  getRecurseNodeTarget
);

const entitiesSelector = createSelector(
  getReactScrollCollapse,
  getEntities
);
/*
  --- entities.collapsers:
*/

const collapsersSelectorRoot = createSelector(entitiesSelector, getCollapsers);


// (collapsersState, { collapserId }) => collapser
const collapserSelectorFactory = () => createSelector(
  getCollapser, collapser => collapser
);

const collapserSelector = cacheSelector(collapserSelectorFactory, 'collapserSelectorFactory', 'collapserId');


// (rootState, { collapserId }) => collapser
const collapserSelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => collapserSelector(collapsersState, props)
);


/*
  --- collapser.collapsers:
*/
const getChildCollapsersArray = collapserObj => arrSelector(collapserObj, 'collapsers');

// (collapsersState, { collapserId }) => childCollapsersArray
const childCollapsersArraySelectorFactory = () => createSelector(
  collapserSelector,
  getChildCollapsersArray
);

const childCollapsersArraySelector = cacheSelector(childCollapsersArraySelectorFactory, 'childCollapsersArraySelectorFactory', 'collapserId');


// rootState, { collapserId }) => childCollapsersArray
const childCollapserArraySelectorRootFactory = () => createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => childCollapsersArraySelector(collapsersState, props)
);
const childCollapserArraySelectorRoot = cacheSelector(childCollapserArraySelectorRootFactory, 'childCollapserArraySelectorRootFactory', 'collapserId');


/*
  --- collapser.items:
*/
const getChildItemsArray = collapserObj => arrSelector(collapserObj, 'items');

// (collapsersState, { collapserId }) => childItemsArray
const childItemsArraySelector = createSelector(collapserSelector, getChildItemsArray);

// (rootState, { collapserId }) => childItemsArray
const childItemArraySelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => childItemsArraySelector(collapsersState, props)
);


/*
  --- collapser.itemsObj
*/
const getItemsObj = collapserObj => arrSelector(collapserObj, 'itemsObj');

// (collapsersState, { collapserId }) => itemsObj
const itemsObjSelectorFactory = () => createSelector(collapserSelector, getItemsObj);
const itemsObjSelector = cacheSelector(itemsObjSelectorFactory, 'itemsObjSelectorFactory', 'collapserId');


// (rootState, { collapserId }) => itemsObj
const itemObjSelectorRootFactory = () => createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => itemsObjSelector(collapsersState, props)
);

const itemObjSelectorRoot = cacheSelector(itemObjSelectorRootFactory, 'itemObjSelectorRootFactory', 'collapserId');


const getItem = (itemsState, { itemId }) => itemsState[itemId];

// (itemsObjState, { itemId }) => item
const itemSelector = createSelector(
  getItem, item => item,
);

// (collapsersState, { collapserId, itemId }) => itemObj
const itemFromCollapserSelector = createSelector(
  itemsObjSelector, itemSelector
);

// (rootState, { collapserId, itemId }) => itemObj
const itemFromCollapserSelectorRoot = createSelector(
  [collapsersSelectorRoot, (_, props) => props],
  (collapsersState, props) => itemFromCollapserSelector(collapsersState, props)
);

/*
  --- item.expanded
*/
const getItemExpanded = itemObj => selectOrVal(itemObj, 'expanded');

// (itemsObjState, { itemId }) => item.expanded
const itemExpandedSelector = createSelector(itemSelector, getItemExpanded);

// (rootState, { itemId }) => childItemsArray
const itemExpandedSelectorRoot = createSelector(
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

const areAllItemsExpandedSelector = cacheSelector(areAllItemsExpandedSelectorFactory, 'areAllItemsExpandedSelectorFactory', 'collapserId');


/*
  -------------------------------- END DONT TOUCH -----------------------------
*/


const allChildItemsExpandedSelector = (state, props) => recurseToNode({
  cache: simpleCache,
  childSelectorFunc: collapserId => childCollapserArraySelectorRoot(state, { collapserId }),
  currentNodeId: props.collapserId,
  evaluationFunc: arr => arr.every(a => (a === true)),
  selectorFunc: collapserId => areAllItemsExpandedSelector(state, { collapserId }),
  targetNodeId: props.targetNodeId,
});

// (rootState, { collapserId }) => { collapserId : []}
const childItemIdArraySelectorFactory = () => createSelector(
  [itemObjSelectorRoot, (_, { collapserId }) => collapserId],
  (itemObj, collapserId) => ([collapserId, Object.keys(itemObj)])
);

const childItemIdArraySelector = cacheSelector(childItemIdArraySelectorFactory, 'childItemIdArraySelectorFactory', 'collapserId');


// (rootState, { collapserId }) => [run till end, concatenate prev values]
const concatenateChildItemArraySelectorFactory = () => createSelector(
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

const concatenateChildItemArraySelector = cacheSelector(concatenateChildItemArraySelectorFactory, 'concatenateChildItemArraySelectorFactory', 'collapserId');

const recursivelyGetChildItems = (state, props) => recurseAllChildren(
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

const allChildItemIdsSelector = cacheSelector(allChildItemIdsSelectorFactory, 'allChildItemIdsSelectorFactory', 'collapserId');
