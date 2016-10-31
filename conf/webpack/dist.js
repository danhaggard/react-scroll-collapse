import path from 'path';
import baseConfig from './base';
import webpack from 'webpack';

const distConfig = (opts) => {
  const {PROJECT_ROOT} = opts;
  const config = baseConfig(opts);
  const srcPath = path.resolve(PROJECT_ROOT, 'src');
  const distPath = path.resolve(PROJECT_ROOT, 'dist/assets');
  const plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin()
  ];
  const resolve = {
    extensions: ['', '.js', '.jsx']
  };
  return {
    ...config,
    cache: false,
    devtool: 'source-map',
    plugins,
    entry: srcPath,
    output: {
      path: distPath,
      filename: 'app.js',
    },
    module: {
      loaders: [
        {
          test: /\.(js|jsx)$/,
          include: [srcPath],
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

export default distConfig;
