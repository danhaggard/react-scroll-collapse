import React from 'react';

import { connect } from 'react-redux';
import Main from '../components/App';

/* Populated by react-webpack-redux:reducer */
const App = (props) => <Main {...props} />;

export default connect()(App);
