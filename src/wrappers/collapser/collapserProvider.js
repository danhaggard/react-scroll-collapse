import createProvider from '../provider';

const collapserProvider = createProvider(
  ['collapsers', 'items'],
  ({ id, parentScrollerId }) => ({
    parentCollapserId: id,
    parentScrollerId,
  }),
  'collapsers'
);

export default collapserProvider;
