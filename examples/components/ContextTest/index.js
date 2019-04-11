import React from 'react';
import styles from './App.scss';

import scrollerProvider from '../../../src/wrappers/scroller/scrollerProvider';
import collapserProvider from '../../../src/wrappers/collapser/collapserProvider';
import itemProvider from '../../../src/wrappers/collapserItem/itemProvider';

const Li = ({ keyArg, val }) => <li>{`${keyArg}: ${val}`}</li>;
const List = ({ rest }) => Object.keys(rest).map(i => (<Li key={i} keyArg={i} val={rest[i]} />));
const Logger = ({ providerName, children, style, ...rest }) => {
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

// import Scroller from '../../../src';
const CL = ({ children }) => <CollapserLogger style={{ marginLeft: '0em' }} providerName="collapserProvider">{children}</CollapserLogger>
const SL = ({ children }) => <ScrollerLogger style={{ marginLeft: '0em' }} providerName="scrollerProvider">{children}</ScrollerLogger>
const IL = ({ children }) => <ItemLogger style={{ marginLeft: '0em' }} providerName="itemProvider">{children}</ItemLogger>


const App = () => (
  <div className={styles.main} style={{ width: '100%' }}>
    <h2>Scroller Logger Test</h2>
    <SL>
      <CL>
        <CL />
        <CL />
        <IL />
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

export default App;
