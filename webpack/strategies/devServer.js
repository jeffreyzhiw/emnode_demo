import _ from 'lodash';
import globalConfig from '../../global.config';
import webpack from 'webpack';

const publicPath = globalConfig.app.publicPath;

export default (config, options) => {
  const thisConfig = config;

  if (!options.debug) {
    return thisConfig;
  }

  const entries = Object.keys(config.entry).filter((entry) => entry !== 'vendor');

  for (const entryName of entries) {
    thisConfig.entry[entryName] = [
      `webpack-dev-server/client?${globalConfig.devServer.host}:${globalConfig.devServer.port}`,
      'webpack/hot/only-dev-server',
      // 'eventsource-polyfill', // necessary for hot reloading with IE
      //'webpack-hot-middleware/client',
    ].concat(thisConfig.entry[entryName]);
  }

  thisConfig.devServer = {
    noInfo: false,
    hot: true,
    historyApiFallback: true,
    // watchOptions: {
    //   aggregateTimeout: 300,
    //   poll: true,
    // },
    stats: {
      cached: false,
      cachedAssets: false,
      colors: true,
      exclude: ['node_modules'],
    },
    publicPath: globalConfig.app.publicPath,
  };

  thisConfig.plugins = thisConfig.plugins.concat([
    //Enables Hot Modules Replacement
    new webpack.HotModuleReplacementPlugin(),
  ]);

  return _.merge({}, thisConfig);
};
