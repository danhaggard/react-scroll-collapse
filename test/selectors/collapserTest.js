import expect from 'expect';
import * as selectors from '../../src/selectors/collapser';

const state = {
  reactScrollCollapse: {
    entities: {
      collapsers: {
        0: {
          collapsers: [1],
          id: 0,
          items: [0],
        },
        1: {
          collapsers: [2],
          id: 1,
          items: [1],
        },
        2: {
          collapsers: [],
          id: 2,
          items: [2],
        },
      },
      items: {
        0: {
          expanded: false,
          id: 0,
          waitingForHeight: false,
        },
        1: {
          expanded: false,
          id: 1,
          waitingForHeight: false,
        },
        2: {
          expanded: true,
          id: 2,
          waitingForHeight: true,
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

const getCollapsers = () => {
  const entities = state.reactScrollCollapse.entities;
  const collapsers = state.reactScrollCollapse.entities.collapsers;
  expect(
    selectors.getCollapsers(entities)
  ).toEqual(collapsers);
};

const getChildCollapsers = () => {
  const collapser = state.reactScrollCollapse.entities.collapsers[0];
  const collapsers = collapser.collapsers;
  expect(
    selectors.getChildCollapsers(collapser)
  ).toEqual(collapsers);
};

const getChildItems = () => {
  const collapser = state.reactScrollCollapse.entities.collapsers[0];
  const items = collapser.items;
  expect(
    selectors.getChildItems(collapser)
  ).toEqual(items);
};

const selectCollapserFunc = () => {
  const collapsers = state.reactScrollCollapse.entities.collapsers;
  const collapser = state.reactScrollCollapse.entities.collapsers[0];

  expect(
    selectors.selectCollapserFunc(collapsers)(0)
  ).toEqual(collapser);
};

const collapsersSelector = () => {
  const collapsers = state.reactScrollCollapse.entities.collapsers;
  expect(
    selectors.collapsersSelector(state)
  ).toEqual(collapsers);
};

const collapserSelector = () => {
  const collapser = state.reactScrollCollapse.entities.collapsers[0];
  expect(
    selectors.collapserSelector(state)(0)
  ).toEqual(collapser);
};

const childCollapsersSelector = () => {
  const collapsers = state.reactScrollCollapse.entities.collapsers[0].collapsers;
  expect(
    selectors.childCollapsersSelector(state)(0)
  ).toEqual(collapsers);
};

const allNestedCollapsersSelector = () => {
  expect(
    selectors.allNestedCollapsersSelector(state)(0)
  ).toEqual([1, 2]);
};

const childItemsSelector = () => {
  const items = state.reactScrollCollapse.entities.collapsers[0].items;
  expect(
    selectors.childItemsSelector(state)(0)
  ).toEqual(items);
};

const allChildItemsSelector = () => {
  expect(
    selectors.allChildItemsSelector(state)(0)
  ).toEqual([0, 1, 2]);
};

const itemExpandedArrSelector = () => {
  expect(
    selectors.itemExpandedArrSelector(state)(0)
  ).toEqual([false, false, true]);
};

const itemWaitingForHeightArrSelector = () => {
  expect(
    selectors.itemWaitingForHeightArrSelector(state)(0)
  ).toEqual([false, false, true]);
};

const itemsSecond = {
  0: {
    expanded: false,
    id: 0,
    waitingForHeight: false,
  },
  1: {
    expanded: false,
    id: 1,
    waitingForHeight: false,
  },
  2: {
    expanded: false,
    id: 2,
    waitingForHeight: false,
  },
};

const itemsThird = {
  0: {
    expanded: true,
    id: 0,
    waitingForHeight: true,
  },
  1: {
    expanded: true,
    id: 1,
    waitingForHeight: true,
  },
  2: {
    expanded: true,
    id: 2,
    waitingForHeight: true,
  },
};
Object.freeze(itemsSecond);
Object.freeze(itemsThird);

const stateSecond = {
  ...state,
  entities: {
    ...state.entities,
    items: {
      ...itemsSecond,
    },
  }
};

const stateThird = {
  ...state,
  entities: {
    ...state.entities,
    items: {
      ...itemsThird,
    },
  }
};
Object.freeze(stateSecond);
Object.freeze(stateThird);

const areAllItemsExpandedSelector = () => {
  expect(
    selectors.areAllItemsExpandedSelector(state)(0)
  ).toEqual(false);
  expect(
    selectors.areAllItemsExpandedSelector(stateSecond)(0)
  ).toEqual(false);
  /*
    This test is failing because createSelect calls the getItems function
    once at the start of the test suite and doesn't call it again.  So when
    we change the items here - it can't see the change - because all the selectors
    composed out of getItems rely on the output of that initial call.

    Leaving this is for now as selectors will be refactored anyway.
  */
  expect(
    selectors.areAllItemsExpandedSelector(stateThird)(0)
  ).toEqual(true);
};

const haveAllItemsReportedHeightSelector = () => {
  expect(
    selectors.haveAllItemsReportedHeightSelector(state)(0)
  ).toEqual(false);
  expect(
    selectors.haveAllItemsReportedHeightSelector(stateSecond)(0)
  ).toEqual(true);
  /*
    This test has the same problem as above.
  */
  expect(
    selectors.haveAllItemsReportedHeightSelector(stateThird)(1)
  ).toEqual(false);
};

describe('react-scroll-collapse', () => {
  describe('selectors', () => {
    describe('collapser', () => {

      describe('function: getCollapsers', () => {
        it('selects', () => {
          getCollapsers();
        });
      });

      describe('function: getChildCollapsers', () => {
        it('selects', () => {
          getChildCollapsers();
        });
      });

      describe('function: getChildItems', () => {
        it('selects', () => {
          getChildItems();
        });
      });

      describe('function: selectCollapserFunc', () => {
        it('selects', () => {
          selectCollapserFunc();
        });
      });

      describe('function: collapsersSelector', () => {
        it('selects', () => {
          collapsersSelector();
        });
      });

      describe('function: collapserSelector', () => {
        it('selects', () => {
          collapserSelector();
        });
      });

      describe('function: childCollapsersSelector', () => {
        it('selects', () => {
          childCollapsersSelector();
        });
      });

      describe('function: allNestedCollapsersSelector', () => {
        it('selects', () => {
          allNestedCollapsersSelector();
        });
      });

      describe('function: childItemsSelector', () => {
        it('selects', () => {
          childItemsSelector();
        });
      });

      describe('function: allChildItemsSelector', () => {
        it('selects', () => {
          allChildItemsSelector();
        });
      });

      describe('function: itemExpandedArrSelector', () => {
        it('selects', () => {
          itemExpandedArrSelector();
        });
      });

      describe('function: itemWaitingForHeightArrSelector', () => {
        it('selects', () => {
          itemWaitingForHeightArrSelector();
        });
      });

      describe('function: areAllItemsExpandedSelector', () => {
        it('selects', () => {
          areAllItemsExpandedSelector();
        });
      });

      describe('function: haveAllItemsReportedHeightSelector', () => {
        it('selects', () => {
          haveAllItemsReportedHeightSelector();
        });
      });
    });
  });
});
