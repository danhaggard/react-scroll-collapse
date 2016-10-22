import expect from 'expect';
import actions from '../../src/actions/';
import * as types from '../../src/actions/const';

const addItem = () => {
  const [collapserId, item] = [0, {expanded: false}];
  const output = {
    type: types.ADD_ITEM,
    payload: {
      collapserId,
      item,
    },
  };

  expect(
    actions.addItem(collapserId, item)
  ).toEqual(output);
};

const removeItem = () => {
  const [collapserId, itemId] = [0, 1];
  const output = {
    type: types.REMOVE_ITEM,
    payload: {
      collapserId,
      itemId,
    },
  };

  expect(
    actions.removeItem(collapserId, itemId)
  ).toEqual(output);
};

const expandCollapse = () => {
  const itemId = 1;
  const output = {
    type: types.EXPAND_COLLAPSE,
    payload: {
      itemId,
    },
  };

  expect(
    actions.expandCollapse(itemId)
  ).toEqual(output);
};

const heightReady = () => {
  const [collapserId, itemId] = [0, 1];
  const output = {
    type: types.HEIGHT_READY,
    payload: {
      collapserId,
      itemId,
    },
  };

  expect(
    actions.heightReady(collapserId, itemId)
  ).toEqual(output);
};

describe('react-scroll-collapse', () => {
  describe('actions', () => {
    describe('collapserItem', () => {

      describe('function: addItem', () => {
        it('returns the right action object', () => {
          addItem();
        });
      });

      describe('function: removeItem', () => {
        it('returns the right action object', () => {
          removeItem();
        });
      });

      describe('function: expandCollapse', () => {
        it('returns the right action object', () => {
          expandCollapse();
        });
      });

      describe('function: heightReady', () => {
        it('returns the right action object', () => {
          heightReady();
        });
      });

    });
  });
});
