import {call, race, put, take, actionChannel, select} from 'redux-saga/effects';
import expect from 'expect';

import * as selectors from '../../src/selectors/collapser';
import * as types from '../../src/actions/const';
import actions from '../../src/actions';

const {haveAllItemsReportedHeightSelector} = selectors;
const {heightReadyAll} = actions;
const {HEIGHT_READY, WATCH_COLLAPSER, REMOVE_COLLAPSER} = types;

import {waitForCollapser, waitForHeightReady} from '../../src/sagas/collapser';

describe('react-scroll-collapse', () => {
  describe('sagas', () => {
    describe('collapser', () => {

      describe('function: waitForCollapser', () => {
        const collapserId = 0;
        const collapserIdInit = 0;
        const watchCollapserChannel = actionChannel(WATCH_COLLAPSER);
        const removeCollapserChannel = actionChannel(REMOVE_COLLAPSER);
        const watchCollapser = {payload: {collapserId}};
        const removeCollapser = {payload: {collapserId}};
        const raceCall = race({
          watchCollapser: take(WATCH_COLLAPSER),
          removeCollapser: take(REMOVE_COLLAPSER)
        });
        const raceYield = {watchCollapser, removeCollapser};
        const gen = waitForCollapser(collapserIdInit);


        it('yields an WATCH_COLLAPSER action channel', () => {
          expect(gen.next().value).toEqual(
            watchCollapserChannel);
        });

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
            gen.next(raceYield).value
          ).toEqual(call(waitForHeightReady, collapserIdInit));
        });

        it('starts another race', () => {
          expect(
            gen.next(() => ({watchCollapser})).value
          ).toEqual(raceCall);
        });

        it('starts another race', () => {
          expect(
            gen.next().value
          ).toEqual();
        });

        it('calls watchCollapserChannel.close', () => {
          expect(
            gen.next({removeCollapser}).value
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
/*
        it('calls watchCollapserChannel.close', () => {
          expect(
            gen.next({payload: {collapserId}}).value
          ).toEqual(call(watchCollapserChannel.close));
        });

        it('calls removeCollapserChannel.close', () => {
          expect(
            gen.next().value
          ).toEqual(call(removeCollapserChannel.close));
        });


        it('selects using the haveAllItemsReportedHeightSelector', () => {
          expect(
            gen.next({payload: {collapserId}}).value
          ).toEqual(select(haveAllItemsReportedHeightSelector));
        });

        it('calls the selector', () => {
          const selector = arg => arg;
          expect(
            gen.next(selector).value
          ).toEqual(call(selector, collapserId));
        });

        it('puts the sheightReadyAll action', () => {
          expect(
            gen.next(true).value
          ).toEqual(
            put(heightReadyAll())
          );
        });

        it('takes the initChannel again', () => {
          expect(
            gen.next(HEIGHT_READY).value
          ).toEqual(
            take(HEIGHT_READY)
          );
        });
*/
      });
    });
  });
});
