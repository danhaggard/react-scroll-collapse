import expect from 'expect';
import actions from '../../src/actions/';
import * as types from '../../src/actions/const';


const addCollapser = () => {
  const scrollerId = 0;
  const parentCollapserId = 0;
  const collapser = {
    test: 'test',
  };
  const output = {
    type: types.ADD_COLLAPSER,
    payload: {
      scrollerId,
      collapser,
      parentCollapserId,
    },
  };
  expect(
    actions.addCollapser(scrollerId, parentCollapserId, collapser)
  ).toEqual(output);
};

const removeCollapser = () => {
  const scrollerId = 0;
  const parentCollapserId = 0;
  const collapserId = 0;
  const output = {
    type: types.REMOVE_COLLAPSER,
    payload: {
      scrollerId,
      collapserId,
      parentCollapserId,
    },
  };

  expect(
    actions.removeCollapser(parentCollapserId, scrollerId, collapserId)
  ).toEqual(output);
};


const expandCollapseAll = () => {
  const items = [0, 1, 2];
  const areAllItemsExpanded = true;
  const output = {
    type: types.EXPAND_COLLAPSE_ALL,
    payload: {
      items,
      areAllItemsExpanded,
    },
  };

  expect(
    actions.expandCollapseAll(items, areAllItemsExpanded)
  ).toEqual(output);
};

const heightReadyAll = () => {
  const output = {
    type: types.HEIGHT_READY_ALL,
  };

  expect(
    actions.heightReadyAll()
  ).toEqual(output);
};

describe('react-scroll-collapse', () => {
  describe('actions', () => {
    describe('collapser', () => {

      describe('function: addCollapser', () => {
        it('returns the right action object', () => {
          addCollapser();
        });
      });

      describe('function: removeCollapser', () => {
        it('returns the right action object', () => {
          removeCollapser();
        });
      });

      describe('function: expandCollapseAll', () => {
        it('returns the right action object', () => {
          expandCollapseAll();
        });
      });

      describe('function: heightReadyAll', () => {
        it('returns the right action object', () => {
          heightReadyAll();
        });
      });
    });
  });
});
