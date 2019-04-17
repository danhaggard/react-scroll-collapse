import {
  entitiesSelector,
  createEntityTypeSelectors
} from './utils';

const item = createEntityTypeSelectors(
  'items',
  entitiesSelector,
  ['expanded', 'waitingForHeight', 'visible', 'queued']
);

export default item;
