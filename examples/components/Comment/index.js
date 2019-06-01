import React from 'react';
import PropTypes from 'prop-types';

import { presets } from 'react-motion';
import { Collapse } from 'react-collapse';
// import { UnmountClosed as Collapse } from 'react-collapse';

import CommentBody from '../CommentBody';
import { ofChildrenTypeOrNothing } from '../../../src/utils/propTypeHelpers';

import { collapserItemController } from '../../../src';
import styles from './Comment.scss';
import { MOTION_SPRINGS, DEFAULT_MOTION_SPRING } from '../../../src/const';


const Comment = (props) => {
  const {
    children,
    collapserItemRef,
    isOpened,
    _reactScrollCollapse: { id },
  } = props;
  let { text } = props;
  const idStr = id.toString();
  text = `Collapser Item ${idStr}: --- ${text}`;
  return (
    <div className={styles.comment} ref={collapserItemRef}>
      <Collapse
        isOpened={isOpened}
        springConfig={DEFAULT_MOTION_SPRING}
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
  children: null,
};

Comment.propTypes = {
  _reactScrollCollapse: PropTypes.object.isRequired,
  children: ofChildrenTypeOrNothing,
  collapserItemRef: PropTypes.object.isRequired, // provided by collapserItemController
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  text: PropTypes.string.isRequired,
};

const PureComment = React.memo(Comment);
export default collapserItemController(PureComment); // wrap and export your component
