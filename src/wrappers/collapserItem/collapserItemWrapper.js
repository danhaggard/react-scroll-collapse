import React, {PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {watchCollapser, setOffsetTop, expandCollapse, heightReady} from '../../actions';

import selectors from '../../selectors';
const {itemExpandedSelector} = selectors.collapserItem;


/*
  collapserItemWrapper is an HoC that is to be used to wrap components which make use
  of react-collapse components.

  It provides the wrapped component with the props:
    isOpened: boolean - which can be used as the <Collapse> isOpened prop.
    onHeightReady: function - which should be passed into the  <Collapse>
      onHeightReady prop.
    expandCollapse: function - which can be used as an event callback to trigger
      change of state.
*/

export const collapserItemWrapper = (WrappedComponent) => {

  class CollapserItemController extends Component {

    constructor(props) {
      super(props);
      /*
        this.setOffsetTop: defines a callback for the saga to call that allows
          the saga to obtain the offsetTop value of the backing instance of this
          component and dispatch that to the redux store.  The saga grabs the
          offsetTop val once the onHeightReady callback has been
          called for every wrapped <Collapse> element in the Collapser.
      */
      this.expandCollapse = () => {
        console.log('this.elem.offsetTop', this.elem.offsetTop);
        this.props.actions.watchCollapser(this.props.parentCollapserId);
        this.props.actions.setOffsetTop(
          () => this.elem.offsetTop,
            this.props.parentScrollerId,
            this.props.parentCollapserId,
        );
        props.actions.expandCollapse(this.props.itemId);
      };
      /*
        Callback to let the collapser know that the height calculated by this
        Collapse element is ready.  The saga won't initiate the auto scroll
        unless it sees the HEIGHT_READY action.
      */
      this.onHeightReady = () => {
        props.actions.heightReady(this.props.parentCollapserId, this.props.itemId);
      };
    }

    componentDidMount() {
      this.elem = ReactDOM.findDOMNode(this);
    }

    render() {
      const {isOpened, actions, ...other} = this.props;
      return (
        <WrappedComponent
          {...other}
          isOpened={isOpened}
          expandCollapse={this.expandCollapse}
          onHeightReady={this.onHeightReady}
        />
      );
    }
  }

  CollapserItemController.propTypes = {
    actions: PropTypes.object,
    isOpened: PropTypes.bool.isRequired,
    itemId: PropTypes.number.isRequired,
    parentCollapserId: PropTypes.number.isRequired,
    parentScrollerId: PropTypes.number.isRequired,
    setOffsetTop: PropTypes.func,
  };

  const mapStateToProps = (state, ownProps) => ({
    isOpened: itemExpandedSelector(state)(ownProps.itemId),
  });

  const mapDispatchToProps = (dispatch) => ({
    actions: bindActionCreators({
      expandCollapse,
      heightReady,
      setOffsetTop,
      watchCollapser,
    }, dispatch),
  });

  const CollapserItemControllerConnect = connect(
    mapStateToProps,
    mapDispatchToProps,
  )(CollapserItemController);

  return CollapserItemControllerConnect;
};
