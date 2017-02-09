'use strict';

import _ from 'lodash';
import webpack from 'webpack';

export default (config, options) => {
  if (!options.debug) {
    config = _.extend({}, config, {
      output: _.extend({}, config.output, {
        filename: '[name].min.js',
      }),
    });
    config.plugins = config.plugins.concat([
      new webpack.NoErrorsPlugin(),
      new webpack.optimize.OccurenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        },
      }),
    ]);
    return config;
  }

  return config;
};
