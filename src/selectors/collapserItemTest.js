import { createSelector } from 'reselect';
import {
  selectOrVal,
  arrSelector,
  getAllNested,
  getAllNestedTest
} from './utils';

// export const getReactScrollCollapse = state => selectOrVal(state, 'reactScrollCollapse');

export const getEntities = state => selectOrVal(state, 'entities');

// export const getEntities = state => getEntitiesFunc(getReactScrollCollapse(state));

export const getItemsFunc = state => selectOrVal(state, 'items');

export const getItemsFromRoot = (state) => {
  console.log('getItemsFromRoot Called');
  return getItemsFunc(getEntities(state));
};


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

export const getChildCollapsersFromRoot = rootState => collapserId => getChildCollapsers(
  getCollapsersFromRoot(rootState)[collapserId]
);

export const getCollapserByIdFromRoot = rootState => collapserId => getCollapsersFromRoot(
  rootState
)[collapserId];

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

export const childCollapsersSelector = createSelector(
  getCollapsersFromRoot,
  collapsers => id => getChildCollapsers(collapsers[id])
);

export const getAllNestedCollapsersWithChildSelector = createSelector(
  childCollapsersSelector,
  getChildCollapsersArg => collapserId => getAllNested(
    collapserId,
    getChildCollapsersArg
  )
);

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

export const getAllNestedCollapsersMax = createSelector(
  childCollapsersSelector,
  getAllNestedTest
);


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
