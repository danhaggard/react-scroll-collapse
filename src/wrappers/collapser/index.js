import { collapserWrapper } from './collapserWrapper';
import { collapserControllerWrapper } from './collapserControllerWrapper';
import providers from '../../contextProviders';

const { collapserProvider } = providers;


export const collapserController = wrappedComponent => collapserProvider(collapserControllerWrapper(
  collapserWrapper(wrappedComponent)
));

export const collapserIdentity = wrappedComponent => collapserProvider(
  collapserControllerWrapper(wrappedComponent)
);

export default collapserController;
