import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './SimpleCollapser.scss';

import ExpandButton from '../ExpandButton';
import { collapserController } from '../../../src';
import { ofChildrenType } from '../../../src/utils/propTypeHelpers';

class EvenSimplerCollapser extends Component {

  render() {
    const {
      children,
      collapserId,
      collapserRef,
      // parentCollapserId,
      style
    } = this.props;
    const title = ` Collapser ${collapserId.toString()}`;
    return (
      <div className={styles.simpleCollapser} ref={collapserRef} style={style}>
        <ExpandButton title={title} />
        { children }
      </div>
    );
  }
}

EvenSimplerCollapser.defaultProps = {
  children: [],
  // parentCollapserId: null,
  style: {},
};

EvenSimplerCollapser.propTypes = {
  children: ofChildrenType,
  collapserId: PropTypes.number.isRequired,
  // parentCollapserId: PropTypes.number,
  style: PropTypes.object,
};

export default collapserController(EvenSimplerCollapser);
