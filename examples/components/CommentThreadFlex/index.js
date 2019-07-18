import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import AnimatedFlexbox from '../../../src/components/AnimatedFlexbox';
import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { getRandomInt } from '../../../src/utils/randomUtils';
import { insertAtIndex, loopArrayIndex, removeFromArray, mapFromNumber } from '../../../src/utils/arrayUtils';
import { generateCommentThreadData } from '../../../src/utils/randomContentGenerators';
import styles from './CommentThread.scss';


class CommentThread extends PureComponent {

  buttonStyle = { order: -2 };

  commentStyle = { order: -1 };

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
      flexOrder: mapFromNumber(children.length, n => ({ order: n })),
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
      // [styles.noChildren]: (children.length === 0 && !areAllItemsExpanded)
      //  || (children.length > 0 && areAllItemsExpanded),
    }
  );

  getFlexBasis = ({ isActiveSibling, noActiveSiblings, collapserRef }) => {
    const { depth } = this.state;
    if (isActiveSibling) {
      return 0.55;
    }
    if (noActiveSiblings && depth < 4) {
      return 0.25;
    }
    if (noActiveSiblings && depth >= 4) {
      return 0.65;
    }
    if (depth >= 3) {
      return 0;
    }
    return 0.15;
  }

  getBackgroundRotation = ({ isActiveSibling, noActiveSiblings, areAllItemsExpanded }) => {
    const { depth } = this.state;

    let direction = 1;
    /*
    if (depth % 2 !== 0) {
      direction = 1;
    }

    if (areAllItemsExpanded && isActiveSibling) {
      return direction * (45 + (depth * 180));
    }
    if (areAllItemsExpanded && noActiveSiblings) {
      return direction * (45 + (depth * 180));
    }
    if (areAllItemsExpanded && !isActiveSibling) {
      return direction * (135 + (depth * 180));
    }
    */
    return direction * (135 + (depth * 180));
  }

  /* ------------------- END - Style / Content - Management - END --------------------- */


  /* ------------------- Event Handlers --------------------- */

  handlePointerDownTimeout = () => {
    this.props.expandCollapseAll();
    if (this.pointerDownTimeoutId) {
      clearTimeout(this.pointerDownTimeoutId);
      this.pointerDownTimeoutId = null;
    }
  }

  handleOnPointerDown = () => {
    this.pointerDownTimeoutId = setTimeout(this.handlePointerDownTimeout, 150);
  }

  handleOnPointerUp = () => {
    if (this.pointerDownTimeoutId) {
      clearTimeout(this.pointerDownTimeoutId);
      this.pointerDownTimeoutId = null;
      this.props.expandCollapseItems();
    }
  }

  handleOnClick = () => {
    // this.props.expandCollapseItems();

    // this.props.expandCollapseAll();
  };

  handleOnDoubleClick = () => {
    // this.props.expandCollapseAll();

    // this.props.expandCollapseItems();
  };

  /*
    right: 39
    left: 37
  */
  handleKeyDown = (e) => {
    // console.log('e.keyCode', e.keyCode);
    if (e.keyCode === 13) {
      this.handleOnPointerDown();
    }
  }

  handleKeyUp = (e) => {
    if (e.keyCode === 13) {
      this.handleOnPointerUp();
    }
  }

  /* ------------------- END - Event Handlers - END --------------------- */


  /* to prevent renders from recreating the style obj everytime */
  // styleObj = { ...this.props.style, zIndex: `${0 - this.state.branch}` };

  render() {
    const {
      setActiveChildLimit,
      areAllItemsExpanded,
      // children,
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
      title,
      flexOrder,
    } = this.state;
    return (
      <AnimatedFlexbox
        className={this.getClassName(this.props)}
        id={collapserId}
        flexBasis={this.getFlexBasis(this.props)}
        backgroundRotation={this.getBackgroundRotation(this.props)}
        isRootNode={isRootNode}
        onPointerDown={this.handleOnPointerDown}
        onPointerUp={this.handleOnPointerUp}
        // onClick={this.handleOnClick}
        // onDoubleClick={this.handleOnDoubleClick}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
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
          style={this.commentStyle}
        />
        {
          localChildren.length > 0 && localChildren.map((childNodeData, index) => (
            <WrappedCommentThread
              setActiveChildLimit={setActiveChildLimit}
              isOpenedInit={childIsOpenedInit}
              childIsOpenedInit={childIsOpenedInit}
              key={childNodeData.key}
              nodeData={childNodeData}
              childInsertionIndex={childInsertionIndex}
              style={flexOrder[index]}
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
  setActiveChildLimit: 1,
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
