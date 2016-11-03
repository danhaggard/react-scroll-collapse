import expect from 'expect';
import * as utils from '../../src/reducers/utils';

const isUndefNull = () => {
  const val1 = undefined;
  const val2 = null;
  const val3 = 'dummy';

  expect(
    utils.isUndefNull(val1)
  ).toEqual(true);
  expect(
    utils.isUndefNull(val2)
  ).toEqual(true);
  expect(
    utils.isUndefNull(val3)
  ).toEqual(false);
};

describe('react-scroll-collapse', () => {
  describe('reducers', () => {
    describe('utils', () => {

      describe('function: isUndefNull', () => {
        it('selects', () => {
          isUndefNull();
        });
      });

    });
  });
});
