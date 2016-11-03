import path from 'path';
import baseConfig from './base';

const testConfig = (opts) => {
  const {PROJECT_ROOT} = opts;
  const config = baseConfig(opts);
  const npmPath = path.join(PROJECT_ROOT, '../../node_modules');
  const getIncludedPackages = () => [].map(pkg => path.join(npmPath, pkg));
  const includedPackages = getIncludedPackages();
  const testPath = path.resolve(PROJECT_ROOT, 'test');
  const srcPath = path.resolve(PROJECT_ROOT, 'src');
  const outputPath = path.resolve(PROJECT_ROOT, './dist/assets');

  const resolve = {
    extensions: ['', '.js', '.jsx'],
    modules: [
      srcPath,
      'node_modules'
    ]
  };
  return {
    ...config,
    devtool: 'inline-source-map',
    entry: './src',
    externals: {
      cheerio: 'window',
      'react/lib/ExecutionEnvironment': true,
      'react/addons': true,
      'react/lib/ReactContext': true,
    },
    output: {
      path: outputPath,
      filename: 'app.js',
      publicPath: './assets/'
    },
    plugins: [
      ...config.plugins,
    ],
    module: {
      preLoaders: [
        {
          test: /\.(js|jsx)$/,
          loader: 'isparta-loader',
          include: [
            srcPath,
          ]
        }
      ],
      loaders: [
        {
          test: /\.cssmodule\.css$/,
          loaders: [
            'style',
            'css?modules&importLoaders=1&localIdentName=[name]-[local]-[hash:base64:5]'
          ]
        },
        { test: /^.((?!cssmodule).)*\.css$/, loader: 'null-loader' },
        {
          test: /\.(sass|scss|less|styl|png|jpg|gif|mp4|ogg|svg|woff|woff2)$/,
          loader: 'null-loader'
        },
        {
          test: /\.json$/, loader: 'json'
        },
        {
          test: /\.(js|jsx)$/,
          include: [...includedPackages, srcPath, testPath],
          loader: 'babel-loader',
          query: {
            presets: ['airbnb']
          },
        }
      ],
    },
    resolve,
  };
};

export default testConfig;
