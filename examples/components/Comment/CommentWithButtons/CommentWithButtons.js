import React from 'react';
import PropTypes from 'prop-types';

import Comment from '..';
import ButtonSmall from '../../Button/ButtonSmall';
import ButtonGroupSmall from '../../Button/ButtonGroup/ButtonGroupSmall';
import InsertChildSettingsForm from '../../InsertChildSettingsForm';
import styles from './CommentWithButtons.scss';

const DeleteThread = ({ childThreads, deleteThread, ...rest }) => (
  childThreads === 0 ? <div /> : (
    <ButtonSmall onClick={deleteThread} type="button" {...rest}>
      Delete Thread
    </ButtonSmall>
  )
);

DeleteThread.propTypes = {
  childThreads: PropTypes.number.isRequired,
  deleteThread: PropTypes.func.isRequired,
};

const AddToThread = ({ addToThread, ...rest }) => (
  <ButtonSmall onClick={addToThread} {...rest}>
    Insert Thread
  </ButtonSmall>
);

AddToThread.propTypes = {
  addToThread: PropTypes.func.isRequired,
};

const PureDeleteThread = React.memo(DeleteThread);
const PureAddToThread = React.memo(AddToThread);

const CommentWithButtons = ({
  addToThread,
  childInsertionIndex,
  minChildren,
  maxChildren,
  minDepth,
  maxDepth,
  childThreads,
  deleteThread,
  setChildInsertionConfig,
  showControls,
  showInsertForm,
  tabFocusButtons,
  text
}) => (
  <Comment
    text={text}
  >
    {
      showControls && (
        <div className={styles.controls}>
          {
            showInsertForm && (
            <InsertChildSettingsForm
              childInsertionIndex={childInsertionIndex}
              minChildren={minChildren}
              maxChildren={maxChildren}
              minDepth={minDepth}
              maxDepth={maxDepth}
              setChildInsertionConfig={setChildInsertionConfig}
              tabFocusButtons={tabFocusButtons}
            />
            )
          }
          <ButtonGroupSmall style={{ margin: '0 0 1em 0' }}>
            <PureDeleteThread
              tabIndex={!tabFocusButtons ? -1 : undefined}
              childThreads={childThreads}
              deleteThread={deleteThread}
            />
            <PureAddToThread
              tabIndex={!tabFocusButtons ? -1 : undefined}
              addToThread={addToThread}
            />
          </ButtonGroupSmall>
        </div>
      )
    }
  </Comment>
);

CommentWithButtons.defaultProps = {
  childInsertionIndex: 0,
  childThreads: 0,
  minChildren: 1,
  maxChildren: 1,
  minDepth: 1,
  maxDepth: 1,
  setChildInsertionConfig: () => null,
  showControls: false,
  showInsertForm: false,
  tabFocusButtons: true, // controls whether or not child buttons can be focused.
};

CommentWithButtons.propTypes = {
  addToThread: PropTypes.func.isRequired,
  childInsertionIndex: PropTypes.number,
  childThreads: PropTypes.number,
  deleteThread: PropTypes.func.isRequired,
  minChildren: PropTypes.number,
  maxChildren: PropTypes.number,
  minDepth: PropTypes.number,
  maxDepth: PropTypes.number,
  setChildInsertionConfig: PropTypes.func,
  showControls: PropTypes.bool,
  showInsertForm: PropTypes.bool,
  tabFocusButtons: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

CommentWithButtons.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentWithButtons'
};

const PureCommentWithButtons = React.memo(CommentWithButtons);
export default PureCommentWithButtons;
