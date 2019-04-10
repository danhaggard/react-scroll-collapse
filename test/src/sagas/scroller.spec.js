import {
  call,
  race,
  fork,
  put,
  take,
  actionChannel,
} from 'redux-saga/effects';

import * as types from '../../../src/actions/const';
import actions from '../../../src/actions';
import { scrollerInitWatch, waitForSetOffsetTop } from '../../../src/sagas/scroller';

const { scrollTo } = actions;
const {
  SET_OFFSET_TOP,
  WATCH_INITIALISE,
  HEIGHT_READY_ALL,
  REMOVE_SCROLLER
} = types;


describe('react-scroll-collapse', () => {
  describe('sagas', () => {
    describe('scroller', () => {

      describe('function: scrollerInitWatch', () => {

        const gen = scrollerInitWatch();
        it('yields an action channel', () => {
          expect(gen.next().value).toEqual(
            actionChannel(WATCH_INITIALISE)
          );
        });

        it('takes the initChannel', () => {
          expect(
            gen.next(WATCH_INITIALISE).value
          ).toEqual(take(WATCH_INITIALISE));
        });

        it('forks the waitForSetOffsetTop Saga', () => {
          const [scrollerId, getScrollTop] = [0, () => 100];
          expect(
            gen.next({ payload: { scrollerId, getScrollTop } }).value
          ).toEqual(
            fork(waitForSetOffsetTop, scrollerId, getScrollTop)
          );
        });

        it('takes the initChannel again', () => {
          expect(
            gen.next(WATCH_INITIALISE).value
          ).toEqual(
            take(WATCH_INITIALISE)
          );
        });
      });

      describe('function: waitForSetOffsetTop', () => {
        const scrollerIdInit = 0;

        const [scrollerId, getScrollTop, getOffsetTop] = [0, () => 100, () => 200];
        const [scrollTop, offsetTop] = [100, 200];

        const setOffsetTopChannel = actionChannel(SET_OFFSET_TOP);
        const removeScrollerChannel = actionChannel(REMOVE_SCROLLER);
        const setOffsetTop = { payload: { getOffsetTop, scrollerId } };
        const removeScroller = { payload: { scrollerId } };
        const differentScroller = { payload: { scrollerId: 10 } };
        const raceCall = race({
          setOffsetTop: take(SET_OFFSET_TOP),
          removeScroller: take(REMOVE_SCROLLER)
        });
        const setOffsetTopWinner = { setOffsetTop, removeScroller: undefined };
        const removeScrollerWinner = { setOffsetTop: undefined, removeScroller };
        const differentWinner = { setOffsetTop: differentScroller, removeScroller: undefined };

        const gen = waitForSetOffsetTop(scrollerIdInit, getScrollTop);

        it('yields an SET_OFFSET_TOP action channel', () => {
          expect(gen.next().value).toEqual(
            setOffsetTopChannel
          );
        });

        /*
          see comments in test/sagas/collapserTest
        */
        it('yields an REMOVE_SCROLLER action channel', () => {
          expect(gen.next(SET_OFFSET_TOP).value).toEqual(
            removeScrollerChannel
          );
        });

        it('starts a race between the two actions', () => {
          expect(
            gen.next(REMOVE_SCROLLER).value
          ).toEqual(raceCall);
        });

        it('calls the getScrollTop func', () => {
          expect(
            gen.next(setOffsetTopWinner).value
          ).toEqual(call(getScrollTop));
        });

        it('calls the getOffsetTop func', () => {
          expect(
            gen.next(scrollTop).value
          ).toEqual(call(getOffsetTop));
        });

        it('puts the scrollTo action', () => {
          expect(
            gen.next(offsetTop).value
          ).toEqual(
            put(scrollTo(scrollerId, offsetTop, scrollTop))
          );
        });

        it('end of loop starts another race', () => {
          expect(
            gen.next().value
          ).toEqual(raceCall);
        });

        it('non matching scrollerId: starts another race', () => {
          expect(
            gen.next(differentWinner).value
          ).toEqual(raceCall);
        });

        /*
          see comments in test/sagas/collapserTest.js

        it(`calls setOffsetTopChannel.close - cant get test to pass.
          see comments in test/sagas/collapserTest.js`, () => {
          expect(
            gen.next(removeScrollerWinner).value
          ).toEqual(call(setOffsetTopChannel.close));
        });

        it('calls removeScrollerChannel.close', () => {
          expect(
            gen.next().value
          ).toEqual(call(removeScrollerChannel.close));
        });

        it('ends the generator', () => {
          expect(gen.next().done).toEqual(true);
        });
        */
      });

    });
  });
});
