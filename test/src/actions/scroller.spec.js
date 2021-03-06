import actions from '../../../src/actions';
import * as types from '../../../src/actions/const';

const addScroller = () => {
  const scroller = { scrollTop: 200 };
  const scrollerId = 0;
  const output = {
    type: types.ADD_SCROLLER,
    payload: {
      scroller,
      scrollerId,
    },
  };

  expect(
    actions.addScroller(scroller, scrollerId)
  ).toEqual(output);
};

const addScrollerChild = () => {
  const collapser = { id: 0 };
  const scrollerId = 0;
  const output = {
    type: types.ADD_SCROLLER_CHILD,
    payload: {
      collapser,
      scrollerId,
    },
  };

  expect(
    actions.addScrollerChild(scrollerId, collapser)
  ).toEqual(output);
};

const removeScroller = () => {
  const scrollerId = 0;
  const output = {
    type: types.REMOVE_SCROLLER,
    payload: {
      scrollerId,
    },
  };

  expect(
    actions.removeScroller(scrollerId)
  ).toEqual(output);
};

const removeScrollerChild = () => {
  const scrollerId = 0;
  const collapserId = 0;
  const output = {
    type: types.REMOVE_SCROLLER_CHILD,
    payload: {
      scrollerId,
      collapserId,
    },
  };

  expect(
    actions.removeScrollerChild(scrollerId, collapserId)
  ).toEqual(output);
};

const setOffsetTop = () => {
  const getOffsetTop = () => 'dummy func';
  const [scrollerId, collapserId, itemId] = [0, 0, 0];
  const output = {
    type: types.SET_OFFSET_TOP,
    payload: {
      getOffsetTop,
      scrollerId,
      collapserId,
      itemId,
    },
  };

  expect(
    actions.setOffsetTop(getOffsetTop, scrollerId, collapserId, itemId)
  ).toEqual(output);
};

const watchInitialise = () => {
  const getScrollTop = () => 'dummy func';
  const scrollerId = 0;
  const output = {
    type: types.WATCH_INITIALISE,
    payload: {
      getScrollTop,
      scrollerId,
    },
  };

  expect(
    actions.watchInitialise(scrollerId, getScrollTop)
  ).toEqual(output);
};

const scrollTo = () => {
  const [scrollerId, offsetTop, scrollTop] = [0, 10, 20];
  const output = {
    type: types.SCROLL_TO,
    payload: {
      scrollerId,
      offsetTop,
      scrollTop,
    },
  };

  expect(
    actions.scrollTo(scrollerId, offsetTop, scrollTop)
  ).toEqual(output);
};

describe('react-scroll-collapse', () => {
  describe('actions', () => {
    describe('scroller', () => {

      describe('function: addScroller', () => {
        it('returns the right action object', () => {
          addScroller();
        });
      });

      describe('function: addScrollerChild', () => {
        it('returns the right action object', () => {
          addScrollerChild();
        });
      });

      describe('function: removeScroller', () => {
        it('returns the right action object', () => {
          removeScroller();
        });
      });

      describe('function: removeScrollerChild', () => {
        it('returns the right action object', () => {
          removeScrollerChild();
        });
      });

      describe('function: setOffsetTop', () => {
        it('returns the right action object', () => {
          setOffsetTop();
        });
      });

      describe('function: watchInitialise', () => {
        it('returns the right action object', () => {
          watchInitialise();
        });
      });

      describe('function: scrollTo', () => {
        it('returns the right action object', () => {
          scrollTo();
        });
      });

    });
  });
});
