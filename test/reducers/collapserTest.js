import expect from 'expect';
import * as reducers from '../../src/reducers/collapser';
import * as types from '../../src/actions/const';

const collapserIdReducerDefault = () => {
  const stateBefore = 0;
  const stateAfter = 0;
  const action = {type: 'DEFAULT'};
  Object.freeze(action);
  expect(
    reducers.collapserIdReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const collapserIdReducerAddCollapser = () => {
  const stateBefore = undefined;
  const stateAfter = 0;
  const action = {
    type: types.ADD_COLLAPSER,
    payload: {
      collapser: {
        id: 0,
      },
    },
  };
  Object.freeze(action);
  expect(
    reducers.collapserIdReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const collapsersIdArrayDefault = () => {
  const stateBefore = [0];
  const stateAfter = [0];
  const action = {type: 'DEFAULT'};
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.collapsersIdArray(stateBefore, action)
  ).toEqual(stateAfter);
};

const collapsersIdArrayAddCollapser = () => {
  const stateBefore = [0];
  const stateAfter = [0, 1];
  const action = {
    type: types.ADD_COLLAPSER_CHILD,
    payload: {
      collapser: {
        id: 1,
      },
    },
  };
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.collapsersIdArray(stateBefore, action)
  ).toEqual(stateAfter);
};

const itemsIdArrayDefault = () => {
  const stateBefore = [0];
  const stateAfter = [0];
  const action = {type: 'DEFAULT'};
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.itemsIdArray(stateBefore, action)
  ).toEqual(stateAfter);
};

const itemsIdArrayAddItem = () => {
  const stateBefore = [0];
  const stateAfter = [0, 1];
  const action = {
    type: types.ADD_ITEM,
    payload: {
      item: {
        id: 1,
      },
    },
  };
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.itemsIdArray(stateBefore, action)
  ).toEqual(stateAfter);
};

const itemsIdArrayRemoveItem = () => {
  const stateBefore = [0, 1];
  const stateAfter = [0];
  const action = {
    type: types.REMOVE_ITEM,
    payload: {
      collapserId: 0,
      itemId: 1,
    },
  };
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.itemsIdArray(stateBefore, action)
  ).toEqual(stateAfter);
};

const collapserReducerDefault = () => {
  const stateBefore = {
    collapsers: [0],
    id: 0,
    items: [0],
  };
  const stateAfter = {
    collapsers: [0],
    id: 0,
    items: [0],
  };
  const action = {type: 'DEFAULT'};
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.collapserReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const collapserReducerAddCollapser = () => {
  const stateBefore = {};
  const stateAfter = {
    collapsers: [],
    id: 0,
    items: [],
  };
  const action = {
    type: types.ADD_COLLAPSER,
    payload: {
      collapser: {
        id: 0,
      },
    },
  };
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.collapserReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

const collapserReducerAddItem = () => {
  const stateBefore = {
    collapsers: [],
    id: 0,
    items: [],
  };
  const stateAfter = {
    collapsers: [],
    id: 0,
    items: [0],
  };
  const action = {
    type: types.ADD_ITEM,
    payload: {
      item: {
        id: 0,
      },
    },
  };
  Object.freeze(action);
  Object.freeze(stateBefore);
  expect(
    reducers.collapserReducer(stateBefore, action)
  ).toEqual(stateAfter);
};

// stateKey_actionType

describe('react=scroll-collapse', () => {
  describe('reducers', () => {
    describe('collapser', () => {

      describe('function: collapserIdReducer', () => {
        describe('type: DEFAULT', () => {
          it('returns the current state', () => {
            collapserIdReducerDefault();
          });
        });

        describe('type: ADD_COLLAPSER', () => {
          it('returns the collapser id', () => {
            collapserIdReducerAddCollapser();
          });
        });
      });

      describe('function: collapsersIdArray', () => {
        describe('type: DEFAULT', () => {
          it('returns the current state', () => {
            collapsersIdArrayDefault();
          });
        });

        describe('type: ADD_COLLAPSER', () => {
          it('adds the collapser id to the array', () => {
            collapsersIdArrayAddCollapser();
          });
        });
      });

      describe('function: itemsIdArray', () => {
        describe('type: DEFAULT', () => {
          it('returns the current state', () => {
            itemsIdArrayDefault();
          });
        });

        describe('type: ADD_ITEM', () => {
          it('adds the item id to the array', () => {
            itemsIdArrayAddItem();
          });
        });

        describe('type: REMOVE_ITEM', () => {
          it('removes the itemId from the array', () => {
            itemsIdArrayRemoveItem();
          });
        });
      });

      describe('function: collapserReducer', () => {
        describe('type: DEFAULT', () => {
          it('returns the current state', () => {
            collapserReducerDefault();
          });
        });

        describe('type: ADD_COLLAPSER', () => {
          it('returns the init state for added collapser', () => {
            collapserReducerAddCollapser();
          });
        });

        describe('type: ADD_ITEM', () => {
          it('returns the init state for added item', () => {
            collapserReducerAddItem();
          });
        });
      });
    });
  });
});
