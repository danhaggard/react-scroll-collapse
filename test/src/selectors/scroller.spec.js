import * as selectors from '../../../src/selectors/scroller';

const state = {
  reactScrollCollapse: {
    entities: {
      scrollers: {
        0: {
          collapsers: [0],
          id: 0,
          offsetTop: 0,
          scrollTop: 0,
        },
        1: {
          collapsers: [1],
          id: 1,
          offsetTop: 0,
          scrollTop: 0,
        },
      },
    },
    scrollers: [0, 1],
  },
};

Object.freeze(state);


const scrollersSelector = () => {
  const scrollers = state.reactScrollCollapse.entities.scrollers;
  expect(
    selectors.scrollersSelector(state)
  ).toEqual(scrollers);
};

const scrollerSelector = () => {
  const scroller = state.reactScrollCollapse.entities.scrollers[0];
  expect(
    selectors.scrollerSelector(state)(0)
  ).toEqual(scroller);
};

const offsetTopSelector = () => {
  const offsetTop = state.reactScrollCollapse.entities.scrollers[0].offsetTop;
  expect(
    selectors.offsetTopSelector(state)(0)
  ).toEqual(offsetTop);
};

const scrollTopSelector = () => {
  const scrollTop = state.reactScrollCollapse.entities.scrollers[0].scrollTop;
  expect(
    selectors.scrollTopSelector(state)(0)
  ).toEqual(scrollTop);
};

describe('react-scroll-collapse', () => {
  describe('selectors', () => {
    describe('scroller', () => {

      describe('function: scrollersSelector', () => {
        it('selects', () => {
          scrollersSelector();
        });
      });

      describe('function: scrollerSelector', () => {
        it('selects', () => {
          scrollerSelector();
        });
      });

      describe('function: offsetTopSelector', () => {
        it('selects', () => {
          offsetTopSelector();
        });
      });

      describe('function: scrollTopSelector', () => {
        it('selects', () => {
          scrollTopSelector();
        });
      });

    });
  });
});
