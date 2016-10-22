import { TRANSITION_WAIT } from './../const';

function action(parameter) {
  return { type: TRANSITION_WAIT, parameter };
}

module.exports = action;
