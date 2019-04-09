import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';
// import Collapse from 'react-collapse';

import { UnmountClosed as Collapse } from 'react-collapse';
import CommentBody from '../CommentBody';
import CommentTitle from '../CommentTitle';

import { collapserItemController } from '../../../src';
import styles from './SimpleComment.scss';

const SimpleComment = (props) => {
  const {
    text,
    isOpened,
    onHeightReady,
    expandCollapse,
    itemId
  } = props;

  const idStr = itemId.toString();
  const title = ` Collapser Item ${idStr}`;
  return (
    <div className={styles.simpleComment}>
      <div onClick={expandCollapse} type="button" role="button" tabIndex={0}>
        <CommentTitle title={title} isOpened={isOpened} />
      </div>
      <Collapse
        isOpened={isOpened}
        springConfig={presets.noWobble}
        onMeasure={onHeightReady}
      >
        <CommentBody text={` Collapser Item Text ${idStr}: --- ${text}`} />
      </Collapse>
    </div>
  );
};

SimpleComment.propTypes = {
  expandCollapse: PropTypes.func.isRequired, // provided by collapserItemController
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  itemId: PropTypes.number.isRequired, // provided by collapserItemController
  onHeightReady: PropTypes.func.isRequired, // provided by collapserItemController
  text: PropTypes.string.isRequired,
};

export default collapserItemController(SimpleComment);
