import React from 'react';
import PropTypes from 'prop-types';

import { Collapse } from 'react-collapse';
// import { UnmountClosed as Collapse } from 'react-collapse';

import CommentBody from '../CommentBody';
import { ofChildrenTypeOrNothing } from '../../../src/utils/propTypeHelpers';

import { collapserItemController } from '../../../src';
import styles from './Comment.scss';
import { /* MOTION_SPRINGS */ DEFAULT_MOTION_SPRING } from '../../../src/const';


const Comment = (props) => {
  const {
    children,
    collapserItemRef,
    expandCollapse,
    isOpened,
    style,
    _reactScrollCollapse: { id },
  } = props;
  let { text } = props;
  const idStr = id.toString();
  text = `Collapser Item ${idStr}: --- ${text}`;
  const onClick = (e) => {
    e.stopPropagation();
    expandCollapse();
  };
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      onClick();
    }
  };
  return (
    <div className={styles.comment} ref={collapserItemRef} style={style}>
      <Collapse
        isOpened={isOpened}
        springConfig={DEFAULT_MOTION_SPRING}
      >
        <div className={styles.commentChildren}>
          { children }
          <CommentBody
            isOpened={isOpened}
            text={text}
            onClick={onClick}
            onKeyDown={handleKeyDown}
          />
        </div>
      </Collapse>
    </div>
  );
};

Comment.defaultProps = {
  children: null,
  style: {},
};

Comment.propTypes = {
  _reactScrollCollapse: PropTypes.object.isRequired,
  children: ofChildrenTypeOrNothing,
  collapserItemRef: PropTypes.object.isRequired, // provided by collapserItemController
  expandCollapse: PropTypes.func.isRequired,
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  style: PropTypes.object,
  text: PropTypes.string.isRequired,
};

Comment.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: 'Comment'
};

const PureComment = React.memo(Comment);
export default collapserItemController(PureComment); // wrap and export your component
