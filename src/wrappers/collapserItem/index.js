import { collapserItemWrapper } from './collapserItemWrapper';
import { collapserItemControllerWrapper } from './collapserItemControllerWrapper';

import providers from '../../contextProviders';

const { itemProvider } = providers;

export const collapserItemController = wrappedComponent => itemProvider(
  collapserItemControllerWrapper(collapserItemWrapper(wrappedComponent))
);

export const collapserItemIdentity = wrappedComponent => itemProvider(
  collapserItemControllerWrapper(wrappedComponent)
);

export default collapserItemController;
