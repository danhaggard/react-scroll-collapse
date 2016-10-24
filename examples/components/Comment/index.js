import React, {PropTypes} from 'react';
import styles from './Comment.scss';

import {presets} from 'react-motion';
import Collapse from 'react-collapse';

import CommentTitle from './../CommentTitle';
import CommentBody from './../CommentBody';

import {collapserItemController} from '../../../src';

const Comment = (props) => {
  const {text, userName, title, isOpened,
    expandCollapseAll, onHeightReady} = props;
  return (
    <div className={styles.comment}>
      <div onClick={expandCollapseAll}>
        <CommentTitle
          userName={userName}
          title={title}
          isOpened={isOpened}
          expandCollapse={expandCollapseAll}
        />
      </div>
      <Collapse
        keepCollapsedContent
        isOpened={isOpened}
        springConfig={presets.noWobble}
        onHeightReady={onHeightReady}
      >
        <CommentBody text={text} />
      </Collapse>
    </div>
  );
};

Comment.propTypes = {
//  expandCollapse: PropTypes.func,
//  areAllItemsExpanded: PropTypes.bool,
  expandCollapseAll: PropTypes.func,
  isOpened: PropTypes.bool,
  itemId: PropTypes.number,
  onHeightReady: PropTypes.func,
  text: PropTypes.string,
  title: PropTypes.string,
  userName: PropTypes.string,
};

export default collapserItemController(Comment);
