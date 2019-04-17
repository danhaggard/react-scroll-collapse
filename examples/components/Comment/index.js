import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';
import { Collapse } from 'react-collapse';

import CommentBody from '../CommentBody';

import { collapserItemController } from '../../../src';
import styles from './Comment.scss';


const Comment = (props) => {
  const {
    children,
    collapserItemRef,
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
        <div className={styles.commentChildren}>
          <CommentBody text={text} />
          { children }
        </div>
      </Collapse>
    </div>
  );
};

Comment.defaultProps = {
  children: [],
};

Comment.propTypes = {
  children: PropTypes.array,
  collapserItemRef: PropTypes.object.isRequired, // provided by collapserItemController
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  itemId: PropTypes.number.isRequired, // provided by collapserItemController
  text: PropTypes.string.isRequired,
};

const PureComment = React.memo(Comment);
export default collapserItemController(PureComment); // wrap and export your component
