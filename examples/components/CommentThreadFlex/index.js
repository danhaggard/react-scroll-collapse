import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import AnimatedFlexbox from '../../../src/components/AnimatedFlexbox';
import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { getRandomInt } from '../../../src/utils/randomUtils';
import { insertAtIndex, loopArrayIndex, removeFromArray } from '../../../src/utils/arrayUtils';
import { generateCommentThreadData } from '../../../src/utils/randomContentGenerators';
import styles from './CommentThread.scss';


class CommentThread extends PureComponent {

  buttonStyle = { order: -5 };

  totalAddedChildren = 0;

  constructor(props, context) {
    super(props, context);
    const {
      childInsertionIndex,
      nodeData: { children, ...rest },
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
    } = this.props;
    this.state = {
      ...rest,
      localChildren: children,
      childInsertionIndex,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      showControls: false,
    };
  }

  /* ------------------- Child Management --------------------- */
  generateChildData = (count, depth) => generateCommentThreadData(
    this.props,
    count,
    depth,
  );

  setChildInsertionConfig = ({ childInsertionIndex, ...rest }) => this.setState(
    ({ localChildren }) => ({
      childInsertionIndex: loopArrayIndex(localChildren, childInsertionIndex),
      ...rest,
    })
  );


  setChildInsertionIndex = val => this.setState(
    ({ localChildren }) => ({ childInsertionIndex: loopArrayIndex(localChildren, val) })
  );

  addChildren = (children, childInsertionIndex = null) => state => ({
    ...state,
    count: state.count + children.length,
    localChildren: insertAtIndex(state.localChildren, children, childInsertionIndex),
  });

  removeChild = ({ localChildren, childInsertionIndex }) => ({
    localChildren: removeFromArray(localChildren, childInsertionIndex),
  });

  insertThread = () => {
    const { count, depth, childInsertionIndex, minChildren, maxChildren } = this.state;
    const numNewChildren = getRandomInt(minChildren, maxChildren);
    const newChildren = [...Array(numNewChildren).keys()].map(
      i => generateCommentThreadData(this.state, count + i, depth + 1)
    );
    this.setState(this.addChildren(newChildren, childInsertionIndex));
  };

  removeThread = () => this.setState(this.removeChild);

  toggleControls = () => this.setState(
    ({ showControls }) => ({ showControls: !showControls })
  );

  /* -------------------END - Child Management - END --------------------- */


  /* ------------------- Style / Content - Management --------------------- */

  appendTitle = (id, title) => ` Collapser ${id.toString()} -- ${title || 'row: 0 - node: 0'}`;

  getClassName = ({ isActiveSibling, children, areAllItemsExpanded }) => cx(
    styles.commentThread, {
      [styles.expanded]: isActiveSibling,
      [styles.noChildren]: (children.length === 0 && !areAllItemsExpanded)
        || (children.length > 0 && areAllItemsExpanded),
    }
  );

  getFlexBasis = ({ isActiveSibling, noActiveSiblings }) => {
    if (isActiveSibling) {
      return 0.65;
    }
    if (noActiveSiblings) {
      return 0.25;
    }
    return 0.15;
  }

  getBackgroundRotation = ({ isActiveSibling, noActiveSiblings, areAllItemsExpanded }) => {
    if (areAllItemsExpanded && isActiveSibling) {
      return 45 + (this.state.depth * 180);
    }
    if (areAllItemsExpanded && noActiveSiblings) {
      return 45 + (this.state.depth * 180);
    }
    if (areAllItemsExpanded && !isActiveSibling) {
      return 225 + (this.state.depth * 180);
    }
    return 225 + (this.state.depth * 180);
  }

  /* ------------------- END - Style / Content - Management - END --------------------- */


  /* ------------------- Event Handlers --------------------- */

  handleOnClick = () => {
    this.props.expandCollapseAll();
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.props.expandCollapseAll();
    }
  }

  /* ------------------- END - Event Handlers - END --------------------- */


  /* to prevent renders from recreating the style obj everytime */
  // styleObj = { ...this.props.style, zIndex: `${0 - this.state.branch}` };

  render() {
    const {
      setActiveChildLimit,
      areAllItemsExpanded,
      children,
      childIsOpenedInit,
      collapserRef,
      _reactScrollCollapse: { id: collapserId, isRootNode },
      isOpenedInit,
      style,
    } = this.props;
    const {
      // branch,
      childInsertionIndex,
      minChildren,
      minDepth,
      maxChildren,
      maxDepth,
      comment,
      localChildren,
      showControls,
      title
    } = this.state;
    return (
      <AnimatedFlexbox
        className={this.getClassName(this.props)}
        id={collapserId}
        flexBasis={this.getFlexBasis(this.props)}
        backgroundRotation={this.getBackgroundRotation(this.props)}
        isRootNode={isRootNode}
        onClick={this.handleOnClick}
        onKeyDown={this.handleKeyDown}
        ref={collapserRef}
        style={style}
      >
        <ExpandButton
          isOpened={areAllItemsExpanded}
          onHamburgerClick={this.toggleControls}
          style={this.buttonStyle}
          title={this.appendTitle(collapserId, title)}
        />
        <CommentWithButtons
          addToThread={this.insertThread}
          childInsertionIndex={childInsertionIndex}
          minChildren={minChildren}
          maxChildren={maxChildren}
          minDepth={minDepth}
          maxDepth={maxDepth}
          setChildInsertionConfig={this.setChildInsertionConfig}
          childThreads={localChildren.length}
          deleteThread={this.removeThread}
          isOpenedInit={isOpenedInit}
          showControls={showControls}
          showInsertForm={showControls}
          tabFocusButtons={areAllItemsExpanded}
          text={comment}
        />
        { children.length > 0 && children }
        {
          localChildren.length > 0 && localChildren.map(childNodeData => (
            <WrappedCommentThread
              setActiveChildLimit={setActiveChildLimit}
              isOpenedInit={childIsOpenedInit}
              childIsOpenedInit={childIsOpenedInit}
              key={childNodeData.key}
              nodeData={childNodeData}
              childInsertionIndex={childInsertionIndex}
              {...{
                minChildren,
                minDepth,
                maxChildren,
                maxDepth,
              }}
            />
          ))
        }
      </AnimatedFlexbox>
    );
  }
}

CommentThread.defaultProps = {
  areAllItemsExpanded: null,
  children: [],
  childInsertionIndex: 0,
  isOpenedInit: true,
  childIsOpenedInit: true,
  maxChildren: 1,
  maxDepth: 1,
  minChildren: 1,
  minDepth: 1,
  setActiveChildLimit: 0,
  style: {},
};

CommentThread.propTypes = {
  areAllItemsExpanded: ofBoolTypeOrNothing,
  children: ofChildrenType,
  childIsOpenedInit: PropTypes.bool,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  childInsertionIndex: ofNumberTypeOrNothing,
  isOpenedInit: PropTypes.bool,
  nodeData: PropTypes.object.isRequired,
  maxChildren: PropTypes.number,
  maxDepth: PropTypes.number,
  minChildren: PropTypes.number,
  minDepth: PropTypes.number,
  _reactScrollCollapse: PropTypes.object.isRequired,
  setActiveChildLimit: PropTypes.number,
  style: PropTypes.object,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentThreadPerf'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
