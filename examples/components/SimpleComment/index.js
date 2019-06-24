import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';

import { Collapse } from 'react-collapse';
import CommentBody from '../CommentBody';
import ExpandButton from '../ExpandButton';

import { collapserItemController } from '../../../src';
import styles from './SimpleComment.scss';

const SimpleComment = (props) => {
  const {
    collapserItemRef,
    expandCollapse,
    isOpened,
    text,
    _reactScrollCollapse: { id },

  } = props;
  const idStr = id.toString();
  const title = ` Collapser Item ${idStr}`;
  return (
    <div className={styles.simpleComment} ref={collapserItemRef}>
      <ExpandButton
        isOpened={isOpened}
        onClick={expandCollapse}
        title={title}
      />
      <Collapse
        isOpened={isOpened}
        springConfig={presets.noWobble}
      >
        <CommentBody text={` Collapser Item Text ${idStr}: --- ${text}`} />
      </Collapse>
    </div>
  );
};

SimpleComment.propTypes = {
  collapserItemRef: PropTypes.object.isRequired, // provided by collapserItemController
  expandCollapse: PropTypes.func.isRequired, // provided by collapserItemController
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  _reactScrollCollapse: PropTypes.object.isRequired,
  text: PropTypes.string.isRequired,
};

export default collapserItemController(SimpleComment);
