import actions from '../../../src/actions';
import * as types from '../../../src/actions/const';


const addCollapser = () => {
  const scrollerId = 0;
  const parentCollapserId = 0;
  const collapser = {
    test: 'test',
  };
  const collapserId = 0;
  const output = {
    type: types.ADD_COLLAPSER,
    payload: {
      scrollerId,
      collapser,
      parentCollapserId,
      collapserId,
    },
  };
  expect(
    actions.addCollapser(scrollerId, parentCollapserId, collapser, collapserId)
  ).toEqual(output);
};

const addCollapserChild = () => {
  const parentCollapserId = 0;
  const collapser = {
    test: 'test',
  };
  const output = {
    type: types.ADD_COLLAPSER_CHILD,
    payload: {
      collapser,
      parentCollapserId,
    },
  };
  expect(
    actions.addCollapserChild(parentCollapserId, collapser)
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

const removeCollapserChild = () => {
  const parentCollapserId = 0;
  const collapserId = 1;
  const output = {
    type: types.REMOVE_COLLAPSER_CHILD,
    payload: {
      collapserId,
      parentCollapserId,
    },
  };
  expect(
    actions.removeCollapserChild(parentCollapserId, collapserId)
  ).toEqual(output);
};


const expandCollapseAll = () => {
  const item = { dummy: 'dummy' };
  const areAllItemsExpanded = true;
  const itemId = 0;
  const output = {
    type: types.EXPAND_COLLAPSE_ALL,
    payload: {
      item,
      areAllItemsExpanded,
      itemId,
    },
  };

  expect(
    actions.expandCollapseAll(item, areAllItemsExpanded, itemId)
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

const watchCollapser = () => {
  const collapserId = 0;
  const output = {
    type: types.WATCH_COLLAPSER,
    payload: {
      collapserId,
    }
  };

  expect(
    actions.watchCollapser(collapserId)
  ).toEqual(output);
};

const watchInitCollapser = () => {
  const collapserId = 0;
  const output = {
    type: types.WATCH_INIT_COLLAPSER,
    payload: {
      collapserId,
    }
  };

  expect(
    actions.watchInitCollapser(collapserId)
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

      describe('function: addCollapserChild', () => {
        it('returns the right action object', () => {
          addCollapserChild();
        });
      });

      describe('function: removeCollapser', () => {
        it('returns the right action object', () => {
          removeCollapser();
        });
      });

      describe('function: removeCollapserChild', () => {
        it('returns the right action object', () => {
          removeCollapserChild();
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

      describe('function: watchCollapser', () => {
        it('returns the right action object', () => {
          watchCollapser();
        });
      });

      describe('function: watchInitCollapser', () => {
        it('returns the right action object', () => {
          watchInitCollapser();
        });
      });

    });
  });
});
