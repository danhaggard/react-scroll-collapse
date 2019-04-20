import * as selectors from '../../../src/selectors/collapserItemTest';
import expandCollapseActionCreator from '../../../src/actions/collapserItem/expandCollapse';
import { itemsReducer } from '../../../src/reducers/collapserItem';
import { reactScrollCollapse } from '../../../src/reducers';

describe('collapserItemTest', () => {
  let state;
  let entitiesState;

  beforeEach(() => {
    state = {
      entities: {
        collapsers: {
          0: {
            collapsers: [2],
            id: 0,
            items: [0],
          },
          1: {
            collapsers: [],
            id: 1,
            items: [1, 2],
          },
          2: {
            collapsers: [],
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
    entitiesState = state.entities;

  });

  describe('getExpandedItems - selects item 1', () => {

    it('selects item 1', () => {
      const expandedItems = selectors.getExpandedItems(entitiesState);
      expect(expandedItems).toEqual([entitiesState.items[1]]);
      expect(selectors.getExpandedItems.recomputations()).toEqual(1);

      const expandCollapseAction = expandCollapseActionCreator(1);
      const newState = reactScrollCollapse(state, expandCollapseAction);

      const expandedItems2 = selectors.getExpandedItems(
        newState.entities
      );
      expect(expandedItems2).toEqual([]);
      expect(selectors.getExpandedItems.recomputations()).toEqual(2);

    });

  });
});
