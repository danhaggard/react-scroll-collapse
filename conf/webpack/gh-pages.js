import path from 'path';
import baseConfig from './base';
import webpack from 'webpack';

const ghPagesConfig = (opts) => {
  const {PROJECT_ROOT} = opts;
  const config = baseConfig(opts);
  const examplesPath = path.resolve(PROJECT_ROOT, 'examples');
  const bundlesPath = path.resolve(examplesPath, 'bundles');
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    // minifies your code
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
    }),
    new webpack.optimize.DedupePlugin()
  ];
  const srcPath = path.resolve(PROJECT_ROOT, 'src');
  const resolve = {
    extensions: ['', '.js', '.jsx']
  };
  return {
    ...config,
    cache: false,
    plugins,
    entry: examplesPath,
    output: {
      path: bundlesPath,
      filename: 'app.js',
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
