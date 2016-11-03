import webpack from 'webpack';

module.exports = (opts) => {

  const {PROJECT_ROOT, NODE_ENV} = opts;

  const plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
      },
    })
  ];

  return {
    context: PROJECT_ROOT,
    plugins,
  };

};
