import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import CommentWithButtons from '../Comment/CommentWithButtons';
import ExpandButton from '../ExpandButton';
import AnimatedFlexbox from '../../../src/components/AnimatedFlexbox';
import { collapserController } from '../../../src';
import { ofBoolTypeOrNothing, ofChildrenType, ofNumberTypeOrNothing } from '../../../src/utils/propTypeHelpers';
import { getRandomInt } from '../../../src/utils/randomUtils';
import {
  insertAtIndex,
  loopArrayIndex,
  removeFromArray,
  mapFromNumber,
  wrapXaroundY,
} from '../../../src/utils/arrayUtils';
import { generateCommentThreadData } from '../../../src/utils/randomContentGenerators';
import styles from './CommentThread.scss';


class CommentThread extends PureComponent {

  buttonStyle = { order: -2 };

  commentStyle = { order: -1 };

  totalAddedChildren = 0;

  transposeBase = 0.3333

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
      // flexOrder: mapFromNumber(children.length, n => ({ order: n, position: 'relative' })),
      flexOrder: mapFromNumber(children.length, () => ({ position: 'relative' })),

      transposing: false,
      childTranspositionCount: 0,
      selfTranspositionCount: 0,
      hasFocus: false,
      focusStyle: {},
    };
  }

  getChildStyle = () => {
    const { transposing } = this.state;
    const newStyle = {
      position: 'relative',
    };
    if (transposing) {
      // newStyle.flexShrink = 0;
    }
    return newStyle;
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

  getFlexBasis = ({ isActiveSibling, noActiveSiblings }) => {
    if (isActiveSibling) {
      return 0.65;
    }

    if (noActiveSiblings) {
      return 0.33;
    }

    if (!isActiveSibling) {
      return 0.25;
    }
    return 1;
  }

  getBackgroundRotation = ({ isActiveSibling, noActiveSiblings, areAllItemsExpanded }) => {
    const { depth } = this.state;

    const direction = 1;
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

  getTransposeStyle = () => {
    const { childTranspositionCount } = this.state;
    const transposeMultiple = this.transposeBase * childTranspositionCount;
    return { left: transposeMultiple };
  }

  setChildTranspositionCount = directionMultiple => this.setState(
    ({ childTranspositionCount, localChildren: { length } }) => {
      const nextTranspositionCount = wrapXaroundY(
        childTranspositionCount + directionMultiple, length
      );
      return { childTranspositionCount: nextTranspositionCount };
    }
  );

  /*
  setTransposeStyle = (directionMultiple) => {
    const { childTranspositionCount, flexOrder, transposeStyle } = this.state;
    const { length } = flexOrder;
    const wrappedTranspositionCount = wrapXaroundY(
      childTranspositionCount + directionMultiple, length
    );
    const baseMultiple = this.transposeBase * wrappedTranspositionCount;
    if (transposeStyle.left !== baseMultiple) {
      this.setState(() => ({
        childTranspositionCount: wrappedTranspositionCount,
        transposeStyle: { left: baseMultiple },
        transposing: true,
      }));
    }
  }
  */
  /* ------------------- END - Style / Content - Management - END --------------------- */


  /* ------------------- Event Handlers --------------------- */

  handlePointerDownTimeout = () => {
    this.props.expandCollapseItems();
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
      this.props.expandCollapseAll();
    }
  }

  handleShiftOrder = (keyCode) => {
    let direction = 0;
    if (keyCode === 39) { // right arrow key
      direction = 1;
    }

    if (keyCode === 37) { // left arrow key
      direction = -1;
    }
    if (direction !== 0) {
      // this.setState(({ flexOrder }) => ({ flexOrder: rotateArray(flexOrder, direction) }));
      this.setChildTranspositionCount(direction);
    }
  }

  handleKeyDown = (e) => {
    const { keyCode } = e;
    this.handleShiftOrder(keyCode);
    if (keyCode === 13) {
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

  handleOnFocus = () => {
    const { distanceFromCenterSibling, _reactScrollCollapse: { id } } = this.props;
    console.log(`id: ${id} distanceFromCenterSibling: ${distanceFromCenterSibling}, transpose: ${distanceFromCenterSibling * this.transposeBase}`);
    const newStyle = { left: distanceFromCenterSibling * this.transposeBase };
    newStyle.flexWrap = 'nowrap';
    this.setState(() => ({
      focusStyle: newStyle,
      hasFocus: true,
      selfTranspositionCount: distanceFromCenterSibling,
    }));
  }

  handleOnBlur = () => {
    this.setState(() => ({
      focusStyle: {},
      childTranspositionCount: 0,
      hasFocus: false,
      // transposeStyle: { left: 0 },
    }));
  }

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
      transposeLeft,
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
      // transposeStyle: { left: transposeLeftState },
      focusStyle,
      selfTranspositionCount,
      hasFocus,
    } = this.state;
    // console.log(`id: ${collapserId}, flexOrder: [${flexOrder.map(obj => JSON.stringify(obj))}]`);
    const finalTransposeLeft = hasFocus ? selfTranspositionCount * this.transposeBase
      : transposeLeft;
    return (
      <AnimatedFlexbox
        // className={this.getClassName(this.props)}
        className={styles.col}
        id={collapserId}
        flexBasis={this.getFlexBasis(this.props)}
        backgroundRotation={this.getBackgroundRotation(this.props)}
        transposeLeft={finalTransposeLeft}
        isRootNode={isRootNode}
        onPointerDown={this.handleOnPointerDown}
        onPointerUp={this.handleOnPointerUp}
        // onClick={this.handleOnClick}
        // onDoubleClick={this.handleOnDoubleClick}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
        ref={collapserRef}
        // renderChildren={this.renderTransposedChildren}
        style={style}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
      >
        <div className={styles.innerCol}>
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
        </div>
        <div className={styles.commentThread} style={focusStyle}>
          {
            localChildren.length > 0 && localChildren.map(childNodeData => (
              <WrappedCommentThread
                transposeLeft={this.getTransposeStyle().left}
                setActiveChildLimit={setActiveChildLimit}
                isOpenedInit={childIsOpenedInit}
                childIsOpenedInit={childIsOpenedInit}
                key={childNodeData.key}
                nodeData={childNodeData}
                childInsertionIndex={childInsertionIndex}
                style={this.getChildStyle()}
                {...{
                  minChildren,
                  minDepth,
                  maxChildren,
                  maxDepth,
                }}
              />
            ))
          }
        </div>
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
  transposeLeft: 0,
};

CommentThread.propTypes = {
  areAllItemsExpanded: ofBoolTypeOrNothing,
  children: ofChildrenType,
  childIsOpenedInit: PropTypes.bool,
  collapserRef: PropTypes.object.isRequired,
  expandCollapseAll: PropTypes.func.isRequired,
  expandCollapseItems: PropTypes.func.isRequired,
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
  transposeLeft: PropTypes.number,
};

CommentThread.whyDidYouRender = {
  logOnDifferentValues: false,
  customName: 'CommentThread'
};

const WrappedCommentThread = collapserController(CommentThread);

export default WrappedCommentThread;
