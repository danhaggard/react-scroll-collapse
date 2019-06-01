import React from 'react';
import PropTypes from 'prop-types';

import Comment from '..';
import ButtonSmall from '../../Button/ButtonSmall';
import ButtonGroupSmall from '../../Button/ButtonGroup/ButtonGroupSmall';


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
  <ButtonSmall onClick={addToThread} type="button" {...rest}>
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
  tabFocusButtons,
  childThreads,
  deleteThread,
  isOpenedInit,
  text
}) => (
  <Comment
    addToThread={addToThread}
    childThreads={childThreads}
    deleteThread={deleteThread}
    isOpenedInit={isOpenedInit}
    text={text}
  >
    <ButtonGroupSmall>
      <PureDeleteThread
        tabIndex={!tabFocusButtons ? -1 : undefined}
        childThreads={childThreads}
        deleteThread={deleteThread}
      />
      <PureAddToThread tabIndex={!tabFocusButtons ? -1 : undefined} addToThread={addToThread} />
    </ButtonGroupSmall>
  </Comment>
);

CommentWithButtons.defaultProps = {
  childThreads: 0,
  isOpenedInit: true,
};

CommentWithButtons.propTypes = {
  childThreads: PropTypes.number,
  addToThread: PropTypes.func.isRequired,
  deleteThread: PropTypes.func.isRequired,
  isOpenedInit: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

CommentWithButtons.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentWithButtons'
};

const PureCommentWithButtons = React.memo(CommentWithButtons);
export default PureCommentWithButtons;
