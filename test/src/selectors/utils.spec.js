import * as selectors from '../../../src/selectors/utils';

const selector = () => {
  const state = {
    key1: 'val',
    key2: false,
    key3: 0,
    key4: undefined,
    key5: null,
  };

  expect(
    selectors.selectOrVal(state, 'key1')
  ).toEqual('val');
  expect(
    selectors.selectOrVal(state, 'key2')
  ).toEqual(false);
  expect(
    selectors.selectOrVal(state, 'key3')
  ).toEqual(0);
  expect(
    selectors.selectOrVal(state, 'key4')
  ).toEqual(null);
  expect(
    selectors.selectOrVal(state, 'key5')
  ).toEqual(null);
  expect(
    selectors.selectOrVal(state, 'key6')
  ).toEqual(null);
};

const arrSelector = () => {
  const state = {
    key1: 'val',
    key2: false,
    key3: 0,
    key4: undefined,
    key5: null,
  };

  expect(
    selectors.arrSelector(state, 'key1')
  ).toEqual('val');
  expect(
    selectors.arrSelector(state, 'key2')
  ).toEqual([]);
  expect(
    selectors.arrSelector(state, 'key3')
  ).toEqual([]);
  expect(
    selectors.arrSelector(state, 'key4')
  ).toEqual([]);
  expect(
    selectors.arrSelector(state, 'key5')
  ).toEqual([]);
  expect(
    selectors.arrSelector(state, 'key6')
  ).toEqual([]);
};

const reactScrollCollapseSelector = () => {
  const state = {
    reactScrollCollapse: {
      entities: 'val',
      scrollers: [0],
    },
  };
  expect(
    selectors.reactScrollCollapseSelector(state)
  ).toEqual(state.reactScrollCollapse);
};

const entitiesSelector = () => {
  const state = {
    reactScrollCollapse: {
      entities: 'val',
      scrollers: [0],
    },
  };
  const { entities } = state.reactScrollCollapse;

  expect(
    selectors.entitiesSelector()(state)
  ).toEqual(entities);
};

const getAllNested = () => {
  const dummySelector = (id) => {
    const state = {
      0: [1, 2, 3, 4],
      1: [],
      2: [5, 6],
      3: [],
      4: [],
      5: [8, 9],
      6: [7],
      7: [10],
      8: [],
      9: [],
      10: [],
    };
    return state[id];
  };

  expect(
    selectors.getAllNested(0, dummySelector)
  ).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 7, 10]);

  expect(
    selectors.getAllNested(1, dummySelector)
  ).toEqual([]);

  expect(
    selectors.getAllNested(2, dummySelector)
  ).toEqual([5, 6, 8, 9, 7, 10]);

  expect(
    selectors.getAllNested(6, dummySelector)
  ).toEqual([7, 10]);
};

describe('react-scroll-collapse', () => {
  describe('selectors', () => {
    describe('utils', () => {

      describe('function: selector', () => {
        it('selects', () => {
          selector();
        });
      });

      describe('function: arrSelector', () => {
        it('selects', () => {
          arrSelector();
        });
      });

      describe('function: scrollerCollapserSelector', () => {
        it('selects', () => {
          reactScrollCollapseSelector();
        });
      });

      describe('function: entitiesSelector', () => {
        it('selects', () => {
          entitiesSelector();
        });
      });

      describe('function: getAllNested', () => {
        it('selects', () => {
          getAllNested();
        });
      });

    });
  });
});
