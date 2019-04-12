import React, { Component, PureComponent } from 'react';
import styles from './App.scss';
import providers from '../../../src/contextProviders';

import { getNextIdFactory } from '../../../src/selectors/utils';
import doEachForNumber from '../../../src/utils/doEachForNumber';

const {
  scrollerProvider,
  collapserProvider,
  itemProvider
} = providers;

const Li = ({ keyArg, val }) => <li>{`${keyArg}: ${val}`}</li>;
const List = ({ rest }) => Object.keys(rest).map(i => (<Li key={i} keyArg={i} val={rest[i]} />));
const Logger = ({
  providerName,
  children,
  style,
  ...rest }) => {

  return (
    <div style={style}>
      <h1>{ providerName }</h1>
      <ul>
        {
          <List rest={rest} />
        }
      </ul>
      {
        children && (
          <div style={{ padding: '1em', paddingRight: '0em', border: '1px solid grey', borderRight: 'none' }}>
            { children }
          </div>
        )
      }
    </div>
  );
};

const Context = React.createContext({ parentScrollerId: null });

const CollapserLogger = collapserProvider(Context, Logger);
const ItemLogger = itemProvider(Context, Logger);
const ScrollerLogger = scrollerProvider(Context, Logger);

/*
const collapserCounter = renderCounter(getNextIdFactory)('collapserProvider');
const scrollerCounter = renderCounter(getNextIdFactory)('scrollerProvider');
const itemCounter = renderCounter(getNextIdFactory)('itemProvider');
*/
// import Scroller from '../../../src';
const CL = ({ children }) => <CollapserLogger style={{ marginLeft: '0em' }} providerName="collapserProvider">{children}</CollapserLogger>
const SL = ({ children }) => <ScrollerLogger style={{ marginLeft: '0em' }} providerName="scrollerProvider">{children}</ScrollerLogger>
const IL = ({ children }) => <ItemLogger style={{ marginLeft: '0em' }} providerName="itemProvider">{children}</ItemLogger>

let instanceCount = 0;



/*
const renderCounter = counter => (name) => {
  const count = counter();
  counterInstance += 1;
  return `${name} - render: ${count()}`;
};
*/
const getCounterInstance = () => {
  instanceCount += 1;
  return {
    instance: getNextIdFactory(),
    instanceCount,
  };
};

const getRenderCounterInstance = instance => name => `${name} - render: ${instance()}`;
/*
const getCounter = instanceObj => ({ dummy }) => {
  const renderCounterInstance = getRenderCounterInstance(instanceObj.instance);
  return renderCounterInstance(`dummy val: ${dummy} - Counter Instance: ${instanceObj.instanceCount}`);
};
*/

const getCounter = instanceGetter => () => {
  const instanceObj = instanceGetter();
  return ({ dummy }) => {
    const renderCounterInstance = getRenderCounterInstance(instanceObj.instance);
    return renderCounterInstance(`dummy val: ${dummy} - Counter Instance: ${instanceObj.instanceCount}`);
  };
};

const createCounter = getCounter(getCounterInstance);


const createStyleCounter = () => {
  const Counter = createCounter();

  class WrappedCounter extends PureComponent {

    /*
    shouldComponentUpdate(nextProps, nextState) {
      console.log('i: ', this.props.i);
      console.log('this.props', this.props);
      console.log('nextProps', nextProps);
      console.log('this.state', this.state);
      console.log('nextState', nextState);
      console.log('');
      console.log('');
    }
    */

    /*
    componentDidUpdate(prevProps, prevState) {
      console.log('i: ', this.props.i);
      console.log('this.props', this.props);
      console.log('prevProps', prevProps);
      console.log('this.state', this.state);
      console.log('prevState', prevState);
      console.log('');
      console.log('');
    }
    */

    render() {
      const { dummy } = this.props;
      return (
        <h3>
          <Counter dummy={dummy} />
        </h3>
      );
    }
  }

  return WrappedCounter;
};


class App extends Component { // eslint-disable-line

  constructor(props) {
    super(props);
    this.state = {
      dummy: 0,
      dummy1: 0,
      dummy2: 0,
    };
    this.counters = {};
    doEachForNumber(props.counterNum, this.addCounter);
  }

  componentDidMount() {
    // setInterval(() => this.setState(state => ({ dummy: state.dummy + 1 })), 1000);
    // setInterval(() => this.setState(state => ({ dummy2: state.dummy2 + 1 })), 5000);
    setTimeout(() => this.setState(state => ({ dummy2: state.dummy2 + 1 })), 5000);

  }

  addCounter = (i) => {
    this.counters[`C${i}`] = createStyleCounter();
  }

  render() {
    const { dummy, dummy1, dummy2 } = this.state;
    const { C0, C1, C2, C3, C4, C5 } = this.counters;
    return (
      <div className={styles.main} style={{ width: '100%' }}>
        <C0 dummy={dummy} i={0} />
        <h2>Scroller Logger Test</h2>
        <SL>
          <C1 dummy={dummy1} i={1} />
          <CL>
            <CL />
            <CL />
            <IL>
              <C2 dummy={dummy2} i={2} />
            </IL>
          </CL>
          <SL>
            <CL>
              <CL>
                <IL />
              </CL>
            </CL>
          </SL>
        </SL>
      </div>
    );
  }
}

App.defaultProps = {
  counterNum: 10,
};

export default App;
