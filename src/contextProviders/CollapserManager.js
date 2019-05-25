import { PureComponent } from 'react';
import createCache from '../caching/recursionCache';
import providerCaches from '../caching/providerCaches';

export const getRootNodeId = (ownId, {
  isRootNode,
  rootNodes,
  providerType
}) => (isRootNode ? ownId : rootNodes[providerType]);


class CollapserManager extends PureComponent {

  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      collapser: {
        ...this,
      },
    };
  }

  getCreateCache = (props) => {
    const { collapserId, isRootNode, providerType } = props;
    const rootNodeId = getRootNodeId(collapserId, props);
    const providerCache = providerCaches[providerType];
    if (isRootNode) {
      providerCache[rootNodeId] = createCache();
    }
    return providerCache[rootNodeId];
  }

  getCache = (props) => {
    if (!this.cache) {
      this.cache = this.getCreateCache(props);
    }
    return this.cache;
  }

}

CollapserManager.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CollapserManager'
};

export default CollapserManager;
