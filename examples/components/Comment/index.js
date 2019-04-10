import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';
import { UnmountClosed as Collapse } from 'react-collapse';
import CommentBody from '../CommentBody';

import { collapserItemController } from '../../../src';
import styles from './Comment.scss';


const Comment = (props) => {
  const {
    addToThread,
    collapserItemRef,
    deleteThread,
    isOpened,
    itemId,
  } = props;
  let { text } = props;
  const idStr = itemId.toString();
  text = `Collapser Item ${idStr}: --- ${text}`;
  return (
    <div className={styles.comment} ref={collapserItemRef}>
      <Collapse
        isOpened={isOpened}
        springConfig={presets.noWobble}
      >
        <CommentBody text={text} />
        {deleteThread}
        {addToThread}
      </Collapse>
    </div>
  );
};

Comment.propTypes = {
  addToThread: PropTypes.node.isRequired,
  collapserItemRef: PropTypes.object.isRequired, // provided by collapserItemController
  deleteThread: PropTypes.node.isRequired,
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  itemId: PropTypes.number.isRequired, // provided by collapserItemController
  text: PropTypes.string.isRequired,
};

export default collapserItemController(Comment); // wrap and export your component
