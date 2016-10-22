import expect from 'expect';
import actions from '../../src/actions/';
import * as types from '../../src/actions/const';

const addScroller = () => {
  const scroller = {scrollTop: 200};
  const output = {
    type: types.ADD_SCROLLER,
    payload: {
      scroller,
    },
  };

  expect(
    actions.addScroller(scroller)
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

const setOffsetTop = () => {
  const getOffsetTop = () => 'dummy func';
  const output = {
    type: types.SET_OFFSET_TOP,
    payload: {
      getOffsetTop,
    },
  };

  expect(
    actions.setOffsetTop(getOffsetTop)
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

      describe('function: removeScroller', () => {
        it('returns the right action object', () => {
          removeScroller();
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
