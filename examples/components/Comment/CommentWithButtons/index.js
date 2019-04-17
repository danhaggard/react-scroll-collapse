import React from 'react';
import PropTypes from 'prop-types';

import Comment from '..';
import ButtonSmall from '../../Button/ButtonSmall';
import ButtonGroup from '../../Button/ButtonGroup';


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
  text
}) => (
  <Comment
    addToThread={addToThread}
    childThreads={childThreads}
    deleteThread={deleteThread}
    text={text}
  >
    <ButtonGroup>
      <PureDeleteThread childThreads={childThreads} deleteThread={deleteThread} />
      <PureAddToThread addToThread={addToThread} />
    </ButtonGroup>
  </Comment>
);

CommentWithButtons.defaultProps = {
  childThreads: 0,
};

CommentWithButtons.propTypes = {
  childThreads: PropTypes.number,
  addToThread: PropTypes.func.isRequired,
  deleteThread: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

const PureCommentWithButtons = React.memo(CommentWithButtons);
export default PureCommentWithButtons;
