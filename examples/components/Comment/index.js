import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';
import { UnmountClosed as Collapse } from 'react-collapse';
import CommentBody from '../CommentBody';

import { collapserItemController } from '../../../src';
import styles from './Comment.scss';


const Comment = (props) => {
  const {
    isOpened,
    onHeightReady,
    deleteThread,
    addToThread,
    itemId
  } = props;
  let { text } = props;
  const idStr = itemId.toString();
  text = `Collapser Item ${idStr}: --- ${text}`;
  return (
    <div className={styles.comment}>
      <Collapse
        isOpened={isOpened}
        springConfig={presets.noWobble}
        onMeasure={onHeightReady}
      >
        <CommentBody text={text} />
        {deleteThread}
        {addToThread}
      </Collapse>
    </div>
  );
};

Comment.propTypes = {
  deleteThread: PropTypes.node,
  addToThread: PropTypes.node.isRequired,
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  itemId: PropTypes.number.isRequired, // provided by collapserItemController
  onHeightReady: PropTypes.func.isRequired, // provided by collapserItemController
  text: PropTypes.string.isRequired,
};

export default collapserItemController(Comment); // wrap and export your component
