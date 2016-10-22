import {call, put, take, actionChannel, select} from 'redux-saga/effects';
import expect from 'expect';

import * as selectors from '../../src/selectors/collapser';
import * as types from '../../src/actions/const';
import actions from '../../src/actions';

const {haveAllItemsReportedHeightSelector} = selectors;
const {heightReadyAll} = actions;
const {HEIGHT_READY} = types;

import {waitForCollapser} from '../../src/sagas/collapser';

describe('react-scroll-collapse', () => {
  describe('sagas', () => {
    describe('collapser', () => {

      describe('function: waitForCollapser', () => {
        const gen = waitForCollapser();
        const collapserId = 0;

        it('yields an action channel', () => {
          expect(gen.next().value).toEqual(
            actionChannel(HEIGHT_READY));
        });

        it('takes the initChannel', () => {
          expect(
            gen.next(HEIGHT_READY).value
          ).toEqual(take(HEIGHT_READY));
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

      });
    });
  });
});
