/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { ofBoolTypeOrNothing } from '../utils/propTypeHelpers';

class CollapserContext extends PureComponent {

  isOpenedInit = this.props.isOpenedInit;

  isOpenedInitOverride = false;

  overrideParentIsOpenedInit = () => (this.isOpenedInitOverride = true);

  getParentIsOpenedInit = isOpenedInitOverride

  constructor(props, context) {
    super(props, context);
    this.contextMethods = {
      collapser: {
        getElem: this.getElem,
        getRef: this.getRef,
        scrollToTop: this.scrollToTop,
        setScrollTop: this.setScrollTop,
      }
    };
  }

}

CollapserContext.defaultProps = {
  isOpenedInit: null,
};

CollapserContext.propTypes = {
  isOpenedInit: ofBoolTypeOrNothing,

};

CollapserContext.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CollapserContext'
};

export default CollapserContext;
