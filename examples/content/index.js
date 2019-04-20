import React from 'react';

import Scroller from '../../src';

import SimpleCollapser from '../components/SimpleCollapser';
import EvenSimplerCollapser from '../components/EvenSimplerCollapser';

import SimpleComment from '../components/SimpleComment';
import CommentThread from '../components/CommentThread';
import Example from '../components/Example';
import { genRandText } from '../utils';

import {
  getExpandedItems,
  getCollapsersWithItems,
  getExpandedItemsFromRoot,
  getCollapsersWithItemsFromRoot,
  getCollapsersWithItemsExpanded,
  getAllNestedCollapsers,
  getAllNestedCollapsersWithChildSelector,
  childCollapsersSelector,
  getAllNestedCollapsersMax,
} from '../../src/selectors/collapserItemTest';
import expandCollapseActionCreator from '../../src/actions/collapserItem/expandCollapse';
import { itemsReducer } from '../../src/reducers/collapserItem';
import { reactScrollCollapse } from '../../src/reducers';

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
        expanded: false,
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
const entitiesState = state.entities;
const expandedItems = getExpandedItems(entitiesState);
console.log('expandedItems', expandedItems);
console.log('getExpandedItems.recomputations()', getExpandedItems.recomputations());
console.log('');


const collapsersWithItems = getCollapsersWithItems(entitiesState);
console.log('collapsersWithItems', collapsersWithItems);
console.log('getCollapsersWithItems.recomputations()', getCollapsersWithItems.recomputations());
console.log('');

const expandedItemsFromRoot = getExpandedItemsFromRoot(state);
console.log('expandedItemsFromRoot', expandedItemsFromRoot);
console.log('getExpandedItemsFromRoot.recomputations()', getExpandedItemsFromRoot.recomputations());
console.log('');

const expandedItemsFromRoot2Repeat = getExpandedItemsFromRoot(state);
console.log('expandedItemsFromRoot2Repeat', expandedItemsFromRoot2Repeat);
console.log('getExpandedItemsFromRoot.recomputations()', getExpandedItemsFromRoot.recomputations());
console.log('');


const collapsersWithItemsFromRoot = getCollapsersWithItemsFromRoot(state);
console.log('collapsersWithItemsFromRoot', collapsersWithItemsFromRoot);
console.log('getCollapsersWithItemsFromRoot.recomputations()', getCollapsersWithItemsFromRoot.recomputations());
console.log('');

const collapsersWithItemsExpanded = getCollapsersWithItemsExpanded(state);
console.log('collapsersWithItemsExpanded', collapsersWithItemsExpanded);
console.log('getCollapsersWithItemsExpanded.recomputations()', getCollapsersWithItemsExpanded.recomputations());
console.log('getCollapsersWithItemsFromRoot.recomputations()', getCollapsersWithItemsFromRoot.recomputations());
console.log('getExpandedItemsFromRoot.recomputations()', getExpandedItemsFromRoot.recomputations());
console.log('');

const getAllNestedCollapsersById = getAllNestedCollapsers(state);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
const allNestedOf0 = getAllNestedCollapsersById(0)
console.log('allNestedOf0', allNestedOf0);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
const allNestedOf1 = getAllNestedCollapsersById(1)
console.log('allNestedOf1', allNestedOf1);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
const allNestedOf2 = getAllNestedCollapsersById(2)
console.log('allNestedOf2', allNestedOf2);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
console.log('');

const getAllNestedCollapsersWithChildSelectorById = getAllNestedCollapsersWithChildSelector(state);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
console.log('childCollapsersSelector.recomputations()', childCollapsersSelector.recomputations());
const allNestedOf0WithChildSelector = getAllNestedCollapsersWithChildSelectorById(0)
console.log('allNestedOf0WithChildSelector', allNestedOf0WithChildSelector);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
console.log('childCollapsersSelector.recomputations()', childCollapsersSelector.recomputations());
const allNestedOf1WithChildSelector = getAllNestedCollapsersWithChildSelectorById(1)
console.log('allNestedOf1WithChildSelector', allNestedOf1WithChildSelector);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
const allNestedOf2WithChildSelector = getAllNestedCollapsersWithChildSelectorById(2)
console.log('allNestedOf2WithChildSelector', allNestedOf2WithChildSelector);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
console.log('');

const getAllNestedCollapsersMaxById = getAllNestedCollapsersMax(state);
console.log('getAllNestedCollapsersMax.recomputations()', getAllNestedCollapsersMax.recomputations());
console.log('childCollapsersSelector.recomputations()', childCollapsersSelector.recomputations());
const allNestedOf0Max = getAllNestedCollapsersMaxById(0)
console.log('allNestedOf0Max', allNestedOf0Max);
console.log('getAllNestedCollapsersMax.recomputations()', getAllNestedCollapsersMax.recomputations());
console.log('childCollapsersSelector.recomputations()', childCollapsersSelector.recomputations());
const allNestedOf1Max = getAllNestedCollapsersMaxById(1)
console.log('allNestedOf1Max', allNestedOf1Max);
console.log('getAllNestedCollapsersMax.recomputations()', getAllNestedCollapsersMax.recomputations());
const allNestedOf2Max = getAllNestedCollapsersMaxById(2)
console.log('allNestedOf2WithChildSelector', allNestedOf2WithChildSelector);
console.log('getAllNestedCollapsersMax.recomputations()', getAllNestedCollapsersMax.recomputations());
console.log('');
const allNestedOf0MaxRepeat = getAllNestedCollapsersMaxById(0)
console.log('allNestedOf0MaxRepeat', allNestedOf0MaxRepeat);
console.log('getAllNestedCollapsersMaxById.recomputations()', getAllNestedCollapsersMax.recomputations());


console.log('');
console.log('----------------------------------------------');
console.log('');
console.log('CREATING NEW STATE ---------------------------');
console.log('');
console.log('----------------------------------------------');
console.log('');
const expandCollapseAction = expandCollapseActionCreator(1);
const newState = reactScrollCollapse(state, expandCollapseAction);
console.log('newState', newState);
console.log('');
const expandedItems2 = getExpandedItems(newState.entities);
console.log('expandedItems2', expandedItems2);
console.log('getExpandedItems.recomputations()', getExpandedItems.recomputations());
console.log('');
const expandedItemsFromRoot2 = getExpandedItemsFromRoot(newState);
console.log('expandedItemsFromRoot2', expandedItemsFromRoot2);
console.log('expandedItemsFromRoot2.recomputations()', getExpandedItemsFromRoot.recomputations());
console.log('');
const collapsersWithItems2 = getCollapsersWithItems(newState.entities);
console.log('collapsersWithItems2', collapsersWithItems2);
console.log('collapsersWithItems.recomputations()', getCollapsersWithItems.recomputations());
console.log('');
const collapsersWithItemsFromRoot2 = getCollapsersWithItemsFromRoot(newState);
console.log('collapsersWithItemsFromRoot2', collapsersWithItemsFromRoot2);
console.log('getCollapsersWithItemsFromRoot.recomputations()', getCollapsersWithItemsFromRoot.recomputations());
console.log('');
const collapsersWithItemsExpanded2 = getCollapsersWithItemsExpanded(newState);
console.log('collapsersWithItemsExpanded', collapsersWithItemsExpanded2);
console.log('getCollapsersWithItemsExpanded.recomputations()', getCollapsersWithItemsExpanded.recomputations());
console.log('getCollapsersWithItemsFromRoot.recomputations()', getCollapsersWithItemsFromRoot.recomputations());
console.log('getExpandedItemsFromRoot.recomputations()', getExpandedItemsFromRoot.recomputations());
console.log('');
console.log('');

const getAllNestedCollapsersById2 = getAllNestedCollapsers(newState);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());

const allNestedOf0b = getAllNestedCollapsersById2(0)
console.log('allNestedOf0b', allNestedOf0b);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
const allNestedOf1b = getAllNestedCollapsersById2(1)
console.log('allNestedOf1b', allNestedOf1b);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
const allNestedOf2b = getAllNestedCollapsersById2(2)
console.log('allNestedOf2b', allNestedOf2b);
console.log('getAllNestedCollapsers.recomputations()', getAllNestedCollapsers.recomputations());
console.log('');

const getAllNestedCollapsersWithChildSelectorById2 = getAllNestedCollapsersWithChildSelector(state);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
console.log('childCollapsersSelector.recomputations()', childCollapsersSelector.recomputations());

const allNestedOf0WithChildSelector2 = getAllNestedCollapsersWithChildSelectorById2(0)
console.log('allNestedOf0WithChildSelector2', allNestedOf0WithChildSelector2);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
const allNestedOf1WithChildSelector2 = getAllNestedCollapsersWithChildSelectorById2(1)
console.log('allNestedOf1WithChildSelector2', allNestedOf1WithChildSelector2);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
const allNestedOf2WithChildSelector2 = getAllNestedCollapsersWithChildSelectorById2(2)
console.log('allNestedOf2WithChildSelector2', allNestedOf2WithChildSelector2);
console.log('getAllNestedCollapsersWithChildSelector.recomputations()', getAllNestedCollapsersWithChildSelector.recomputations());
console.log('');


/*
const selectInner = (collapsersWithItemsArg, expandedItemsArg) => collapsersWithItemsArg.filter((collapser) => {
  // const collapserItems = getCollapserItems(collapser);
  return Object.values(expandedItems).some(item => collapser.items.includes(item.id));
});

const blah = selectInner(collapsersWithItemsFromRoot2, expandedItemsFromRoot2);
console.log('blah', blah);
*/
const COPY = {
  0: {
    title: 'Single Collapser',
    text: `A single collapser.  react-scroll-collapse provides methods and state
    to keep track of the expanded stateus of the child components`
  },
  1: {
    title: 'Multiple Collapsers',
    text: `You can use as many collapsers on a page as you like.  react-scroll-collapse
    will keep track of the state of each independently.`
  },
  2: {
    title: 'Nested Collapsers',
    text: `You can nest collapsers as well for a great threaded effect.  Nesting
    is tracked so that children can be controlled at any level of the tree.`
  },
  3: {
    title: 'Auto Scroll',
    text: `Embedd your collapsers in the Scroller Component for auto scrolling
    power!`
  },
  4: {
    title: 'Multiple Scrolling Components',
    text: `You can use multiple scrollers as well!
    State is tracked separately for each`
  },
  5: {
    title: 'A single collapser item',
    text: '',
  }
};

const example0 = (
  <Example {...COPY[0]} key={0} style={{}}>
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example1 = (
  <Example {...COPY[1]} key={0} style={{}}>
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
    <SimpleCollapser initialComments={6} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example2 = (
  <Example {...COPY[2]} key={0} style={{}}>
    <CommentThread childThreads={3} style={{ margin: 0, overflow: 'auto' }} />
  </Example>
);

const example3 = (
  <Example {...COPY[3]} key={3}>
    <Scroller style={{ height: '100%' }}>
      <SimpleCollapser initialComments={10} />
      <SimpleCollapser initialComments={10} />
    </Scroller>
  </Example>
);


const example4 = key => (
  <Example {...COPY[4]} style={{ marginBottom: '3em' }} key={key}>
    <Scroller style={{ height: '100%' }}>
      <CommentThread childThreads={3} />
    </Scroller>
  </Example>
);

const text = genRandText();
const example5 = (
  <Example {...COPY[5]} style={{ marginBottom: '3em' }} key={5}>
    <EvenSimplerCollapser>
      <SimpleComment text={genRandText()} />
    </EvenSimplerCollapser>
    <EvenSimplerCollapser>
      <SimpleComment isOpenedInit={false} text={genRandText()} />
      <SimpleComment text={genRandText()} />
    </EvenSimplerCollapser>
  </Example>
);

/*
const examples = {
  0: [example0],
  1: [example1],
  2: [example2],
  3: [example3],
  4: [example4(4), example4(5)]
};
*/

const examples = {
  0: [],
};
export default examples;
