import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';

import { UnmountClosed as Collapse } from 'react-collapse';
import CommentBody from '../CommentBody';
import ExpanderButton from '../ExpandButton';

import { collapserItemController } from '../../../src';
import styles from './SimpleComment.scss';

const SimpleComment = (props) => {
  const {
    collapserItemRef,
    expandCollapse,
    isOpened,
    itemId,
    text,
  } = props;

  const idStr = itemId.toString();
  const title = ` Collapser Item ${idStr}`;
  return (
    <div className={styles.simpleComment} ref={collapserItemRef}>
      <ExpanderButton
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
  itemId: PropTypes.number.isRequired, // provided by collapserItemController
  text: PropTypes.string.isRequired,
};

export default collapserItemController(SimpleComment);
