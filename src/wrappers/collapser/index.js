import { collapserWrapper } from './collapserWrapper';
import { collapserControllerWrapper } from './collapserControllerWrapper';
import providers from '../../contextProviders';

const { collapserProvider } = providers;

export const collapserController = wrappedComponent => collapserProvider(collapserControllerWrapper(
  collapserWrapper(wrappedComponent)
));

export default collapserController;
