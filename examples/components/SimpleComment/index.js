import React, {PropTypes} from 'react';
import styles from './SimpleComment.scss';

import {presets} from 'react-motion';
import Collapse from 'react-collapse';
import CommentBody from './../CommentBody';
import CommentTitle from './../CommentTitle';

import {collapserItemController} from '../../../src';

const SimpleComment = (props) => {
  const {text, isOpened, onHeightReady, expandCollapse, itemId} = props;

  const idStr = itemId.toString();
  const title = ` Comment Title ${idStr}`;
  return (
    <div className={styles.simpleComment}>
      <div onClick={expandCollapse}>
        <CommentTitle title={title} isOpened={isOpened} />
      </div>
      <Collapse
        keepCollapsedContent
        isOpened={isOpened}
        springConfig={presets.noWobble}
        onHeightReady={onHeightReady}
      >
        <CommentBody text={` Comment Text ${idStr}: --- ${text}`} />
      </Collapse>
    </div>
  );
};

SimpleComment.propTypes = {
  expandCollapse: PropTypes.func, // provided by collapserItemController
  isOpened: PropTypes.bool.isRequired, // provided by collapserItemController
  itemId: PropTypes.number, // provided by collapserItemController
  onHeightReady: PropTypes.func.isRequired, // provided by collapserItemController
  text: PropTypes.string,
};

export default collapserItemController(SimpleComment);
