import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import createCache from '../../../caching/recursionCache';
import providerCaches from '../../../caching/providerCaches';
import providerWorkers from '../../../caching/providerWorkers';
import { setContextAttrs } from '../../../utils/objectUtils';

/*
  Really is a cache manager - but only the collapser is using it.

  Cache needs to be accessible to all collapsers as info is stored there
  about their location in the tree - as well as
*/

const collapserManager = (Comp) => {
  class CollapserManager extends PureComponent {

    setAttrs = (() => setContextAttrs(this))();

    getCreateCache = () => { // eslint-disable-line
      const { isRootNode, rootNodeId, type } = this;
      const providerCache = providerCaches[type];
      if (isRootNode) {
        providerCache[rootNodeId] = createCache(rootNodeId);
      }
      return providerCache[rootNodeId];
    }

    getCache = () => {
      if (!this.cache) {
        this.cache = this.getCreateCache();
      }
      this.cache.unlockCache();
      return this.cache;
    }

    getWorker = () => {
      const { rootNodeId, type } = this;
      const workerCache = providerWorkers[type];
      return workerCache.getWorker(rootNodeId);
    }

    registerMountWithCache = (() => {
      const cache = this.getCache();
      const { orphanNodeCache } = cache;
      const {
        _reactScrollCollapse: { id },
        _reactScrollCollapseParents: { collapser }
      } = this.props;
      orphanNodeCache.registerIncomingMount(id, collapser);
    })();

    render() {
      return (
        <Comp
          {...this.props}
          areAllItemsExpandedWorker={this.getWorker()}
          cache={this.cache}
        />
      );
    }
  }

  CollapserManager.propTypes = {
    _reactScrollCollapse: PropTypes.object.isRequired,
    _reactScrollCollapseParents: PropTypes.object.isRequired,
  };

  CollapserManager.whyDidYouRender = {
    logOnDifferentValues: false,
    customName: 'CollapserManager'
  };

  return CollapserManager;
};

export default collapserManager;
