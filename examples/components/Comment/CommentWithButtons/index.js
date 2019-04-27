import React from 'react';
import PropTypes from 'prop-types';

import Comment from '..';
import ButtonSmall from '../../Button/ButtonSmall';
import ButtonGroupSmall from '../../Button/ButtonGroup/ButtonGroupSmall';


const DeleteThread = ({ childThreads, deleteThread }) => (
  childThreads === 0 ? <div /> : (
    <ButtonSmall onClick={deleteThread} type="button">
      Delete Thread
    </ButtonSmall>
  )
);

DeleteThread.propTypes = {
  childThreads: PropTypes.number.isRequired,
  deleteThread: PropTypes.func.isRequired,
};

const AddToThread = ({ addToThread }) => (
  <ButtonSmall onClick={addToThread} type="button">
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
      <PureDeleteThread childThreads={childThreads} deleteThread={deleteThread} />
      <PureAddToThread addToThread={addToThread} />
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

const PureCommentWithButtons = React.memo(CommentWithButtons);
export default PureCommentWithButtons;
