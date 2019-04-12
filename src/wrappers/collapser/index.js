import { collapserWrapper } from './collapserWrapper';
import { collapserControllerWrapper } from './collapserControllerWrapper';
import providers from '../../contextProviders';

const { CONTEXTS, collapserProvider } = providers;
const applyContext = comp => collapserProvider(CONTEXTS.MAIN, comp);

export const collapserController = wrappedComponent => applyContext(collapserControllerWrapper(
  collapserWrapper(wrappedComponent)
));

export default collapserController;
