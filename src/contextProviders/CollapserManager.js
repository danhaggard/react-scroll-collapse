import React, { PureComponent } from 'react';
import createCache from '../caching/recursionCache';
import providerCaches from '../caching/providerCaches';

const getRootNodeId = ({
  collapserId,
  isRootNode,
  providerType,
  rootNodes,
}) => (isRootNode ? collapserId : rootNodes[providerType]);

const collapserManager = (Comp) => {
  class CollapserManager extends PureComponent {

    getCreateCache = (props, rootNodeId) => {
      const { isRootNode, providerType } = props;
      const providerCache = providerCaches[providerType];
      if (isRootNode) {
        providerCache[rootNodeId] = createCache();
      }
      return providerCache[rootNodeId];
    }

    getCache = (props, rootNodeId) => {
      if (!this.cache) {
        this.cache = this.getCreateCache(props, rootNodeId);
      }
      return this.cache;
    }

    render() {
      const rootNodeId = getRootNodeId(this.props);
      return (
        <Comp
          {...this.props}
          cache={this.getCache(this.props, rootNodeId)}
          rootNodeId={rootNodeId}
        />
      );
    }
  }

  CollapserManager.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserManager'
  };

  return CollapserManager;
};

export default collapserManager;
