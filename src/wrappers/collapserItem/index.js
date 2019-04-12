import { collapserItemWrapper } from './collapserItemWrapper';
import { collapserItemControllerWrapper } from './collapserItemControllerWrapper';

import providers from '../../contextProviders';

const { CONTEXTS, itemProvider } = providers;
const applyContext = comp => itemProvider(CONTEXTS.MAIN, comp);

export const collapserItemController = wrappedComponent => applyContext(collapserItemControllerWrapper(
  collapserItemWrapper(wrappedComponent)
));

export default collapserItemController;
