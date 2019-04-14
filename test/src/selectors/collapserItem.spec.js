import itemMain, * as selectors from '../../../src/selectors/collapserItem';

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

const getItemExpanded = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  expect(
    itemMain.getters.getExpanded(item)
  ).toEqual(item.expanded);
};

const getItemId = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  expect(
    itemMain.getters.getId(item)
  ).toEqual(item.id);
};

const getItemWaitingForHeight = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  expect(
    itemMain.getters.getWaitingForHeight(item)
  ).toEqual(item.waitingForHeight);
};

const itemSelector = () => {
  const item = state.reactScrollCollapse.entities.items[0];
  expect(
    itemMain.itemsInstanceSelector()(state)(0)
  ).toEqual(item);
};

const itemExpandedSelector = () => {
  const expanded = state.reactScrollCollapse.entities.items[0].expanded;
  expect(
    itemMain.selectors.expandedSelector()(state)(0)
  ).toEqual(expanded);
};

const itemWaitingForHeightSelector = () => {
  const waitingForHeight = state.reactScrollCollapse.entities.items[0].waitingForHeight;
  expect(
    itemMain.selectors.waitingForHeightSelector()(state)(0)
  ).toEqual(waitingForHeight);
};

describe('react-scroll-collapse', () => {
  describe('selectors', () => {
    describe('collapserItem', () => {

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
