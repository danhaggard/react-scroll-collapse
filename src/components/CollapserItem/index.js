import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Collapse } from 'react-collapse';

import { ofChildrenType } from '../../utils/propTypeHelpers';
import { MOTION_SPRINGS } from '../../const';


class CollapserItem extends PureComponent {


  render() {
    const {
      children,
      className,
      collapserItemRef,
      isOpened,
      style,
    } = this.props;
    return (
      <div
        className={className}
        ref={collapserItemRef}
        style={style}
      >
        <Collapse
          isOpened={isOpened}
          springConfig={MOTION_SPRINGS.fast}
        >
          {children}
        </Collapse>
      </div>
    );
  }
}

CollapserItem.defaultProps = {
  children: [],
  className: '',
  style: {},
};

CollapserItem.propTypes = {
  children: ofChildrenType,
  collapserItemRef: PropTypes.object.isRequired, // provided by collapserItemController
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  className: PropTypes.string,
  style: PropTypes.object,
};

CollapserItem.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CollapserItem'
};

export default CollapserItem;
