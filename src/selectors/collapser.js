
import {
  arrSelector,
  createEntityTypeSelectors,
  entitiesSelector,
  getAllNested,
  createAllNestedOfTypeSelector,
  createAllNestedDependentSelector,
  dependentGetterFactory,
  createAllSelector,
  createSomeSelector,
  createNoneSelector,
  concatDependents
} from './utils';

import itemSelectors from './collapserItem';

const {
  itemsInstanceSelector,
  selectors: { waitingForHeightSelector, expandedSelector }
} = itemSelectors;

const collapser = createEntityTypeSelectors(
  'collapsers',
  entitiesSelector,
  ['collapsers', 'items'],
  arrSelector
);

const { selectors: { collapsersSelector, itemsSelector } } = collapser;

export const allNestedCollapsersSelector = createAllNestedOfTypeSelector(
  collapsersSelector, getAllNested
);

// state => id => { all nested item ids of scrollerCollapser.entities.collapsers[id] }
export const allChildItemsIdSelector = createAllNestedDependentSelector(
  allNestedCollapsersSelector, itemsSelector
)(dependentGetterFactory(concatDependents));

const getterFactory = dependentGetterFactory();
export const allChildItemsSelector = createAllNestedDependentSelector(
  allChildItemsIdSelector, itemsInstanceSelector
)(getterFactory);

export const itemExpandedArrSelector = createAllNestedDependentSelector(
  allChildItemsIdSelector, expandedSelector
)(getterFactory);

export const itemWaitingForHeightArrSelector = createAllNestedDependentSelector(
  allChildItemsIdSelector, waitingForHeightSelector
)(getterFactory);

export const areAllItemsExpandedSelector = createAllSelector(itemExpandedArrSelector);
const allExpanded = areAllItemsExpandedSelector();
export const areAllItemsExpandedSelectorTimerFunc = () => {
  let total = 0;
  let value = false;
  return state => (id, parentAreAllItemsExpanded) => {
    const t1 = performance.now();
    value = allExpanded(state)(id);
    const t2 = performance.now();
    total += (t2 - t1);
    //console.log('collapserId, parentAreAllItemsExpanded', id, parentAreAllItemsExpanded);
    //console.log('areAllItemsExpanded, time, totaltime', value, t2 - t1, total);
    //console.log('')
    return value;
  };
};

export const areAllItemsExpandedSelectorTimer = areAllItemsExpandedSelectorTimerFunc()

export const areSomeItemsExpandedSelector = createSomeSelector(itemExpandedArrSelector);

export const haveAllItemsReportedHeightSelector = createNoneSelector(
  itemWaitingForHeightArrSelector
);

export default collapser;
