import { createSelector } from 'reselect';
import {
  selectOrVal,
  arrSelector,
  getAllNested,
  // getAllNestedTest,
  // getAllNestedWithCondition,
} from './utils';
/*
// export const getReactScrollCollapse = state => selectOrVal(state, 'reactScrollCollapse');

export const getEntities = state => selectOrVal(state, 'entities');

// export const getEntities = state => getEntitiesFunc(getReactScrollCollapse(state));

export const getItemsFunc = state => selectOrVal(state, 'items');

export const getItemsFromRoot = state => getItemsFunc(getEntities(state));


export const getItems = entitiesState => selectOrVal(entitiesState, 'items');

export const getItemIsExpanded = item => selectOrVal(item, 'expanded');

export const getExpandedItems = createSelector(
  getItems,
  items => Object.values(items)
    .filter(item => getItemIsExpanded(item))
);

export const getExpandedItemsFromRoot = createSelector(
  getItemsFromRoot,
  (items) => {
    console.log('getExpandedItemsFromRoot second Arg called');
    return Object.values(items).filter(item => getItemIsExpanded(item));
  }
);


export const getCollapsers = entitiesState => selectOrVal(entitiesState, 'collapsers');

export const getCollapsersFunc = state => arrSelector(state, 'collapsers');

export const getCollapsersFromRoot = rootState => getCollapsersFunc(getEntities(rootState));

export const getCollapserItems = collapser => arrSelector(collapser, 'items');

export const getChildCollapsers = collapser => arrSelector(collapser, 'collapsers');

export const getChildCollapsersFromRoot = (rootState, { collapserId }) => getChildCollapsers(
  getCollapsersFromRoot(rootState)[collapserId]
);

export const getChildItemArrFromCollapser = (rootState, { collapserId }) => getCollapserItems(
  getCollapsersFromRoot(rootState)[collapserId]
);

export const getChildItemArrFromCollapserId = rootState => collapserId => getCollapserItems(
  getCollapsersFromRoot(rootState)[collapserId]
);

export const everyChildItemExpanded = rootState => (childItemIdArr) => {
  const items = getItemsFromRoot(rootState);
  return childItemIdArr.every(itemId => items[itemId].expanded);
};

export const everyChildItemExpandedCondition = rootState => (collapserId) => {
  const childItemArr = getChildItemArrFromCollapserId(rootState)(collapserId);
  const isEveryChildExpanded = everyChildItemExpanded(rootState)(childItemArr);
  // console.log('everyChildItemExpandedCondition: collapserId, childItemArr, isEveryChildExpanded', collapserId, childItemArr, isEveryChildExpanded);
  return [!isEveryChildExpanded, isEveryChildExpanded];
};


export const getCollapserByIdFromRoot = (rootState, { collapserId }) => getCollapsersFromRoot(
  rootState
)[collapserId];


const getChildCollapsersById = rootState => collapserId => getChildCollapsers(
  getCollapsersFromRoot(rootState)[collapserId]
);

const getAllNestWithConditionFromRootProp = (
  rootState,
  { collapserId }
) => (
  selectorFunc,
  breakCondition
) => getAllNestedWithCondition(collapserId, selectorFunc, breakCondition);


// THIS ONE!
export const areAllChildItemsExpandedByIdFromRoot = () => createSelector(
  [getChildCollapsersById, everyChildItemExpandedCondition, getAllNestWithConditionFromRootProp],
  (
    getChildCollapsersArg,
    everyChildItemExpandedArg,
    getAllNestedArg
  ) => getAllNestedArg(getChildCollapsersArg, everyChildItemExpandedArg)
);


export const getCollapsersWithItems = createSelector(
  getCollapsers,
  collapsers => Object.values(collapsers)
    .filter(collapser => getCollapserItems(collapser).length > 0)
);

export const getCollapsersWithItemsFromRoot = createSelector(
  getCollapsersFromRoot,
  collapsers => Object.values(collapsers)
    .filter(collapser => getCollapserItems(collapser).length > 0)
);

export const getCollapsersWithItemsExpanded = createSelector(
  [getCollapsersWithItemsFromRoot, getExpandedItemsFromRoot],
  (collapsersWithItems, expandedItems) => collapsersWithItems.filter(
    collapser => Object.values(expandedItems).some(item => collapser.items.includes(item.id))
  )
);

export const getAllNestedCollapsers = createSelector(
  getChildCollapsersFromRoot,
  getChildCollapsersArg => collapserId => getAllNested(
    collapserId,
    getChildCollapsersArg
  )
);

/*
export const getAllNestedCollapsersWithChildSelector = createSelector(
  childCollapsersSelector,
  getChildCollapsersArg => collapserId => getAllNested(
    collapserId,
    getChildCollapsersArg
  )
);
*/


/*
export const allNestedCollapsersSelector = createSelector(
  id => selectorFunc => getAllNested(id, selectorFunc)
);


/*
export const getAllNestedCollapsersMax = createSelector(
  childCollapsersSelector,
  getChildCollapsersArg => collapserId => allNestedCollapsersSelector(
    collapserId,
    getChildCollapsersArg
  )
);
*/
/*
export const getAllNestedCollapsersMax = createSelector(
  childCollapsersSelector,
  getAllNestedTest
);
*/


/*
export const getAllNestedChildCollapsersFromRoot = (rootState, props) => {
  const selectorFunc = id => getChildCollapsers(
    getCollapsersFromRoot(rootState)[id]
  );
  const { collapserId } = props;
  return getAllNested(collapserId, selectorFunc);
};
/*
export const getAllNestedCollapsersSelectorProps = createSelector(
  getAllNestedChildCollapsersFromRoot,
  arr => arr
);
*/

/*
export const getAllNested = selectorFunc => id => {
  console.log('getAllNested id', id);
  const concatChildren = (arr, i) => {

    const newArr = !arr ? [] : arr;
    if (i + 1 > newArr.length) {
      return newArr;
    }
    const nextChildren = selectorFunc(newArr[i]);

    return concatChildren([...newArr, ...nextChildren], i + 1);
  };
  return concatChildren(selectorFunc(id), 0);
};

export const getAllNestedByState = state => selectorFunc => id =>

*/


/*
const state = {
  entities: {
    collapsers: {
      0: {
        collapsers: [1, 2],
        id: 0,
        items: [0],
      },
      1: {
        collapsers: [],
        id: 1,
        items: [1, 2],
      },
      2: {
        collapsers: [3],
        id: 2,
        items: [3],
      },
      3: {
        collapsers: [],
        id: 3,
        items: [],
      }
    },
    items: {
      0: {
        expanded: false,
        id: 0,
        waitingForHeight: false,
      },
      1: {
        expanded: true,
        id: 1,
        waitingForHeight: false,
      },
      2: {
        expanded: true,
        id: 2,
        waitingForHeight: false,
      },
      3: {
        expanded: true,
        id: 3,
        waitingForHeight: false,
      },
    },
  },
};
*/
