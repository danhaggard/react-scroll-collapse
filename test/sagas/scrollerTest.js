import {call, fork, put, take, actionChannel} from 'redux-saga/effects';
import expect from 'expect';

import * as types from '../../src/actions/const';
import actions from '../../src/actions';

const {scrollTo} = actions;
const {SET_OFFSET_TOP, WATCH_INITIALISE, HEIGHT_READY_ALL} = types;

import {
  scrollerInitWatch,
  waitForSetOffsetTop,
  waitForCollapserFinishSignal
} from '../../src/sagas/scroller';

describe('react-scroll-collapse', () => {
  describe('sagas', () => {
    describe('scroller', () => {

      describe('function: scrollerInitWatch', () => {

        const gen = scrollerInitWatch();
        it('yields an action channel', () => {
          expect(gen.next().value).toEqual(
            actionChannel(WATCH_INITIALISE));
        });

        it('takes the initChannel', () => {
          expect(
            gen.next(WATCH_INITIALISE).value
          ).toEqual(take(WATCH_INITIALISE));
        });

        it('forks the waitForSetOffsetTop Saga', () => {
          const [scrollerId, getScrollTop] = [0, () => 100];
          expect(
            gen.next({payload: {scrollerId, getScrollTop}}).value
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
        const [scrollerId, getScrollTop] = [0, () => 100];
        const gen = waitForSetOffsetTop(scrollerId, getScrollTop);
        it('yields an action channel', () => {
          expect(gen.next().value).toEqual(
            actionChannel(SET_OFFSET_TOP));
        });

        it('takes the initChannel', () => {
          expect(
            gen.next(SET_OFFSET_TOP).value
          ).toEqual(take(SET_OFFSET_TOP));
        });

        it('forks the waitForCollapserFinishSignal Saga', () => {
          const getOffsetTop = () => 200;
          expect(
            gen.next({payload: {getOffsetTop}}).value
          ).toEqual(
            fork(waitForCollapserFinishSignal, scrollerId, getScrollTop, getOffsetTop)
          );
        });

        it('takes the initChannel again', () => {
          expect(
            gen.next(SET_OFFSET_TOP).value
          ).toEqual(
            take(SET_OFFSET_TOP)
          );
        });
      });


      describe('function: waitForCollapserFinishSignal', () => {
        const [scrollerId, getScrollTop, getOffsetTop] = [0, () => 100, () => 200];
        const [scrollTop, offsetTop] = [100, 200];
        const gen = waitForCollapserFinishSignal(scrollerId, getScrollTop, getOffsetTop);
        it('takes the height_ready_all action', () => {
          expect(gen.next().value).toEqual(
            take(HEIGHT_READY_ALL));
        });

        it('calls the getScrollTop func', () => {
          expect(
            gen.next().value
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

        it('ends the generator', () => {
          expect(gen.next().done).toEqual(true);
        });

      });

    });
  });
});
