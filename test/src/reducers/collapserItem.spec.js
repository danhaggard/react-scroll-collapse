import * as reducers from '../../../src/reducers/collapserItem';
import * as types from '../../../src/actions/const';

const expandedReducerAddItem = () => {
  const action = {
    type: types.ADD_ITEM,
    payload: {
      collapserId: 0,
    },
  };
  const action2 = {
    type: types.ADD_ITEM,
    payload: {
      collapserId: 0,
      item: {
        itemId: 0,
        expanded: false,
      },
    },
  };
  Object.freeze(action);
  Object.freeze(action2);
  expect(
    reducers.expandedReducer(undefined, action)
  ).toEqual(true);
  expect(
    reducers.expandedReducer(undefined, action2)
  ).toEqual(false);
};

const expandedReducerExpandCollapse = () => {
  const stateBefore = false;
  const stateAfter = true;
  const action = {
    type: types.EXPAND_COLLAPSE,
    payload: {
      collapserId: 0,
      itemId: 0,
      isFullyExpanded: true,
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.expandedReducer(stateBefore, action)
  ).toEqual(stateAfter);
  expect(
    reducers.expandedReducer(stateAfter, action)
  ).toEqual(stateBefore);
};

const expandedReducerExpandCollapseAll = () => {
  const stateBefore = true;
  const stateAfter = false;
  const action = {
    type: types.EXPAND_COLLAPSE_ALL,
    payload: {
      items: [0, 1, 2],
      expanded: true,
      areAllItemsExpanded: true,
    },
  };
  Object.freeze(action);
  expect(
    reducers.expandedReducer(stateBefore, action)
  ).toEqual(stateAfter);
  expect(
    reducers.expandedReducer(stateAfter, action)
  ).toEqual(stateAfter);
};

const itemIdReducerAddItem = () => {
  const stateBefore = undefined;
  const stateAfter = 0;
  const action = {
    type: types.ADD_ITEM,
    payload: {
      collapserId: 0,
      item: {
        id: 0,
        expanded: false,
      },
    },
  };
  Object.freeze(action);
  expect(
    reducers.itemIdReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const waitingForHeightReducerAddItem = () => {
  const stateBefore = undefined;
  const stateAfter = false;
  const action = {
    type: types.ADD_ITEM,
    payload: {
      collapserId: 0,
    },
  };
  Object.freeze(action);
  expect(
    reducers.waitingForHeightReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const waitingForHeightReducerHeightReady = () => {
  const stateBefore = true;
  const stateAfter = false;
  const action = {
    type: types.HEIGHT_READY,
    payload: {
      itemId: 0,
    },
  };
  Object.freeze(action);
  expect(
    reducers.waitingForHeightReducer(stateBefore, action)
  ).toEqual(stateAfter);
  expect(
    reducers.waitingForHeightReducer(stateAfter, action)
  ).toEqual(stateAfter);
};


const waitingForHeightReducerExpandCollapse = () => {
  const stateBefore = false;
  const stateAfter = true;
  const action = {
    type: types.EXPAND_COLLAPSE,
    payload: {
      itemId: 0,
    },
  };
  Object.freeze(action);
  expect(
    reducers.waitingForHeightReducer(stateBefore, action)
  ).toEqual(stateAfter);
  expect(
    reducers.waitingForHeightReducer(stateAfter, action)
  ).toEqual(stateAfter);
};

const waitingForHeightReducerExpandCollapseAll = () => {
  const actionFactory = (areAllItemsExpanded = true, expanded = false) => ({
    type: types.EXPAND_COLLAPSE_ALL,
    payload: {
      item: {
        expanded,
      },
      areAllItemsExpanded,
      itemId: 0,
    },
  });
  const firstAction = actionFactory();
  const secondAction = actionFactory(false);
  const thirdAction = actionFactory(false, true);

  expect(
    reducers.waitingForHeightReducer(false, firstAction)
  ).toEqual(true);
  expect(
    reducers.waitingForHeightReducer(false, secondAction)
  ).toEqual(true);
  expect(
    reducers.waitingForHeightReducer(false, thirdAction)
  ).toEqual(false);
};

const itemsReducerAddItem = () => {
  const stateBefore = {};
  const stateAfter = {
    0: {
      expanded: true,
      id: 0,
      waitingForHeight: false,
    },
  };
  const action = {
    type: types.ADD_ITEM,
    payload: {
      collapserId: 0,
      item: {
        id: 0,
      },
      itemId: 0,
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.itemsReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const itemsReducerRemoveItem = () => {
  const stateBefore = {
    0: {
      expanded: true,
      id: 0,
      waitingForHeight: false,
    },
  };
  const stateAfter = {};
  const action = {
    type: types.REMOVE_ITEM,
    payload: {
      collapserId: 0,
      itemId: 0,
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.itemsReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const itemsReducerExpandCollapse = () => {
  const stateBefore = {
    0: {
      expanded: false,
      id: 0,
      waitingForHeight: false,
    },
  };
  const stateAfter = {
    0: {
      expanded: true,
      id: 0,
      waitingForHeight: true,
    },
  };
  const action = {
    type: types.EXPAND_COLLAPSE,
    payload: {
      itemId: 0,
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.itemsReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const itemsReducerExpandCollapseAll = () => {
  const stateBefore = {
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
  const stateAfter = {
    0: {
      expanded: true,
      id: 0,
      waitingForHeight: true,
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
  const action = {
    type: types.EXPAND_COLLAPSE_ALL,
    payload: {
      item: {
        expanded: false,
        id: 0,
        waitingForHeight: false,
      },
      areAllItemsExpanded: false,
      itemId: 0,
    },
  };
  Object.freeze(stateBefore);
  Object.freeze(action);
  expect(
    reducers.itemsReducer(stateBefore, action)
  ).toEqual(stateAfter);
};


describe('react=scroll-collapse', () => {
  describe('reducers', () => {
    describe('collapserItem', () => {

      describe('function: expandedReducer', () => {
        describe('type: ADD_ITEM', () => {
          it('returns true by default, or a false value if supplied', () => {
            expandedReducerAddItem();
          });
        });
        describe('type: EXPAND_COLLAPSE', () => {
          it('reverses the truth value of the previous state', () => {
            expandedReducerExpandCollapse();
          });
        });
        describe('type: EXPAND_COLLAPSE_ALL', () => {
          it('sets the truth value to the negated val of isFullyExpanded', () => {
            expandedReducerExpandCollapseAll();
          });
        });
      });

      describe('function: itemIdReducer', () => {
        describe('type: ADD_ITEM', () => {
          it('returns true by default, or a false value if supplied', () => {
            itemIdReducerAddItem();
          });
        });
      });

      describe('function: waitingForHeight', () => {
        describe('type: ADD_ITEM', () => {
          it('sets state to false', () => {
            waitingForHeightReducerAddItem();
          });
        });
        describe('type: EXPAND_COLLAPSE', () => {
          it('sets state to true', () => {
            waitingForHeightReducerExpandCollapse();
          });
        });
        describe('type: EXPAND_COLLAPSE_ALL', () => {
          it('sets state to true', () => {
            waitingForHeightReducerExpandCollapseAll();
          });
        });
        describe('type: HEIGHT_READY', () => {
          it('sets state to false', () => {
            waitingForHeightReducerHeightReady();
          });
        });
      });

      describe('function: itemsReducer', () => {
        describe('type: ADD_ITEM', () => {
          it('creates item state for each id in the array', () => {
            itemsReducerAddItem();
          });
        });
        describe('type: REMOVE_ITEM', () => {
          it('creates item state for each id in the array', () => {
            itemsReducerRemoveItem();
          });
        });
        describe('type: EXPAND_COLLAPSE', () => {
          it('assigns the value returned from the item reducer to the item', () => {
            itemsReducerExpandCollapse();
          });
        });
        describe('type: EXPAND_COLLAPSE_ALL', () => {
          it('expands each collapser', () => {
            itemsReducerExpandCollapseAll();
          });
        });
      });
    });
  });
});
