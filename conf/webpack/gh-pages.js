import path from 'path';
import baseConfig from './base';

const ghPagesConfig = (opts) => {
  const {PROJECT_ROOT} = opts;
  const config = baseConfig(opts);
  const examplesPath = path.resolve(PROJECT_ROOT, 'examples');
  const srcPath = path.resolve(PROJECT_ROOT, 'src');
  const resolve = {
    extensions: ['', '.js', '.jsx']
  };
  return {
    ...config,
    devtool: '#source-map',
    entry: examplesPath,
    output: {
      path: examplesPath,
      filename: 'bundle.js',
      publicPath: './assets/'
    },
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          include: [examplesPath, srcPath],
          exclude: /node_modules/,
          loader: 'babel'
        },
        {
          test: /\.scss$/,
          loaders: [
            'style',
            'css?sourceMap&localIdentName=[path][name]---[local]',
            'sass?sourceMap&localIdentName=[path][name]---[local]'
          ]
        },
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules&localIdentName=[path][name]---[local]'
        }
      ],
    },
    resolve,
  };
};

export default ghPagesConfig;
