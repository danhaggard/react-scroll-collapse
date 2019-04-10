require('@babel/register')({
  presets: ['@babel/preset-env']
});
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const opener = require('opener');
const config = require('../webpack.config.babel.js');

const portNumber = 8080;
const targetEntry = `http://localhost:${portNumber}/`;
config.entry.unshift(`webpack-dev-server/client?${targetEntry}`);

const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  historyApiFallback: true,
  contentBase: config.entry,
  hot: true,
  filename: config.output.filename,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  },
});
server.listen(portNumber, 'localhost', (err) => {
  if (err) {
    console.log(err); // eslint-disable-line
  }
  console.log(`Listening at localhost:${portNumber}`); // eslint-disable-line
  console.log('Opening your system browser...'); // eslint-disable-line
  opener(targetEntry);
});
