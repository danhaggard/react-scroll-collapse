import * as selectors from '../../../src/selectors/collapserItem';

const state = {
  reactScrollCollapse: {
    entities: {
      collapsers: {
        0: {
          collapsers: [],
          id: 0,
          items: [0],
        },
      },
      items: {
        0: {
          expanded: false,
          id: 0,
          waitingForHeight: false,
        },
      },
      scrollers: {
        0: {
          collapsers: [0],
          id: 0,
          offsetTop: 0,
          scrollTop: 0,
        },
      },
    },
    scrollers: [0],
  },
};
Object.freeze(state);

const getItems = () => {
  const entities = state.reactScrollCollapse.entities;
  const items = state.reactScrollCollapse.entities.items;
  expect(
    selectors.getItems(entities)
  ).toEqual(items);
};

const getItemExpanded = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  const expanded = item.expanded;
  expect(
    selectors.getItemExpanded(item)
  ).toEqual(expanded);
};

const getItemId = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  const id = item.id;
  expect(
    selectors.getItemId(item)
  ).toEqual(id);
};

const getItemWaitingForHeight = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  const waitingForHeight = item.waitingForHeight;
  expect(
    selectors.getItemWaitingForHeight(item)
  ).toEqual(waitingForHeight);
};

const itemsSelector = () => {
  const items = state.reactScrollCollapse.entities.items;
  expect(
    selectors.itemsSelector(state)
  ).toEqual(items);
};

const itemSelector = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  expect(
    selectors.itemSelector(state)(0)
  ).toEqual(item);
};

const itemExpandedSelector = () => {
  const expanded = state.reactScrollCollapse.entities.items[0].expanded;
  expect(
    selectors.itemExpandedSelector(state)(0)
  ).toEqual(expanded);
};

const itemWaitingForHeightSelector = () => {
  const waitingForHeight = state.reactScrollCollapse.entities.items[0].waitingForHeight;
  expect(
    selectors.itemWaitingForHeightSelector(state)(0)
  ).toEqual(waitingForHeight);
};

describe('react-scroll-collapse', () => {
  describe('selectors', () => {
    describe('collapserItem', () => {

      describe('function: getItems', () => {
        it('selects', () => {
          getItems();
        });
      });

      describe('function: getItemExpanded', () => {
        it('selects', () => {
          getItemExpanded();
        });
      });

      describe('function: getItemId', () => {
        it('selects', () => {
          getItemId();
        });
      });

      describe('function: getItemWaitingForHeight', () => {
        it('selects', () => {
          getItemWaitingForHeight();
        });
      });

      describe('function: itemsSelector', () => {
        it('selects', () => {
          itemsSelector();
        });
      });

      describe('function: itemSelector', () => {
        it('selects', () => {
          itemSelector();
        });
      });

      describe('function: itemExpandedSelector', () => {
        it('selects', () => {
          itemExpandedSelector();
        });
      });

      describe('function: itemWaitingForHeightSelector', () => {
        it('selects', () => {
          itemWaitingForHeightSelector();
        });
      });

    });
  });
});
