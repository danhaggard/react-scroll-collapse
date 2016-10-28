import {call, race, fork, put, take, actionChannel, select} from 'redux-saga/effects';
import expect from 'expect';

import * as selectors from '../../src/selectors/collapser';
import * as types from '../../src/actions/const';
import actions from '../../src/actions';

const {haveAllItemsReportedHeightSelector} = selectors;
const {heightReadyAll} = actions;
const {HEIGHT_READY, WATCH_COLLAPSER, REMOVE_COLLAPSER, WATCH_INIT_COLLAPSER} = types;

import {collapserInitWatch, waitForCollapser, waitForHeightReady} from '../../src/sagas/collapser';

describe('react-scroll-collapse', () => {
  describe('sagas', () => {
    describe('collapser', () => {

      describe('function: waitForHeightReady', () => {
        const collapserIdInit = 0;
        const gen = waitForHeightReady(collapserIdInit);
        const dummySelector = id => id;

        it('takes the HEIGHT_READY action', () => {
          expect(gen.next().value).toEqual(
            take(HEIGHT_READY));
        });

        it('selects haveAllItemsReportedHeightSelector', () => {
          expect(gen.next().value).toEqual(
            select(haveAllItemsReportedHeightSelector));
        });

        it('calls the selector', () => {
          expect(
            gen.next(dummySelector).value
          ).toEqual(call(dummySelector, collapserIdInit));
        });

        it('loops takes the HEIGHT_READY action', () => {
          expect(gen.next(false).value).toEqual(
            take(HEIGHT_READY));
        });

        it('selects haveAllItemsReportedHeightSelector', () => {
          expect(gen.next().value).toEqual(
            select(haveAllItemsReportedHeightSelector));
        });

        it('calls the selector', () => {
          expect(
            gen.next(dummySelector).value
          ).toEqual(call(dummySelector, collapserIdInit));
        });

        it('puts the HEIGHT_READY_ALL action', () => {
          expect(gen.next(true).value).toEqual(
            put(heightReadyAll())
          );
        });

        it('ends the generator', () => {
          expect(gen.next().done).toEqual(true);
        });
      });

      describe('function: collapserInitWatch', () => {
        const initChannel = actionChannel(WATCH_INIT_COLLAPSER);
        const collapserId = 0;
        const collapser = {payload: {collapserId}};
        const gen = collapserInitWatch();

        it('yields an WATCH_INIT_COLLAPSER action channel', () => {
          expect(gen.next().value).toEqual(
            initChannel);
        });

        it('takes the WATCH_INIT_COLLAPSER action', () => {
          expect(gen.next(WATCH_INIT_COLLAPSER).value).toEqual(
            take(WATCH_INIT_COLLAPSER));
        });

        it('calls fork(waitForCollapser, collapserId)', () => {
          expect(
            gen.next(collapser).value
          ).toEqual(fork(waitForCollapser, collapserId));
        });

        it('takes the WATCH_INIT_COLLAPSER action', () => {
          expect(gen.next().value).toEqual(
            take(WATCH_INIT_COLLAPSER));
        });
      });

      describe('function: waitForCollapser', () => {
        const collapserId = 0;
        const collapserIdInit = 0;
        const watchCollapserChannel = actionChannel(WATCH_COLLAPSER);
        const removeCollapserChannel = actionChannel(REMOVE_COLLAPSER);
        const watchCollapser = {payload: {collapserId}};
        const removeCollapser = {payload: {collapserId}};
        const differentCollapser = {payload: {collapserId: 10}};
        const raceCall = race({
          watchCollapser: take(WATCH_COLLAPSER),
          removeCollapser: take(REMOVE_COLLAPSER)
        });
        const watchWinner = {watchCollapser, removeCollapser: undefined};
        const removeWinner = {watchCollapser: undefined, removeCollapser};
        const differentWinner = {watchCollapser: differentCollapser, removeCollapser: undefined};
        const gen = waitForCollapser(collapserIdInit);

        it('yields an WATCH_COLLAPSER action channel', () => {
          expect(gen.next().value).toEqual(
            watchCollapserChannel);
        });

        /*
          Ordinarily would pass in watchCollapserChannel into next here.
          But because the take is nested in the race - we have to put here
          the action string.  This causes problems later on when we want to
          test the call on the actionChannel
        */
        it('yields an REMOVE_COLLAPSER action channel', () => {
          expect(gen.next(WATCH_COLLAPSER).value).toEqual(
            removeCollapserChannel);
        });

        it('starts a race between the two actions', () => {
          expect(
            gen.next(REMOVE_COLLAPSER).value
          ).toEqual(raceCall);
        });

        it('calls waitForHeightReady with collapserIdInit arg ', () => {
          expect(
            gen.next(watchWinner).value
          ).toEqual(call(waitForHeightReady, collapserIdInit));
        });

        it('end of loop starts another race', () => {
          expect(
            gen.next().value
          ).toEqual(raceCall);
        });

        it('non matching collapserId: starts another race', () => {
          expect(
            gen.next(differentWinner).value
          ).toEqual(raceCall);
        });

        /*
          These next two tests won't pass because we passed in an action type
          string in order to get the tests above to work.  Should be enough
          to know that the function is getting called though - even though
          the test doesn't pass.
        */
        it(`calls watchCollapserChannel.close - cant get test to pass.
          see comments in test/sagas/collapserTest.js`, () => {
          expect(
            gen.next(removeWinner).value
          ).toEqual(call(watchCollapserChannel.close));
        });

        it('calls removeCollapserChannel.close', () => {
          expect(
            gen.next().value
          ).toEqual(call(removeCollapserChannel.close));
        });

        it('ends the generator', () => {
          expect(gen.next().done).toEqual(true);
        });
      });
    });
  });
});
