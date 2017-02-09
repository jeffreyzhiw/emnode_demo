import _ from 'lodash';
import path from 'path';

const nodeModulesDir = path.resolve(process.cwd(), 'node_modules');

export default (config, options) => {
  const thisConfig = {
    module: {
      /**
       * Loaders to interpret non-vanilla javascript code
       * as well as most other extensions including images and text.
       */
      preLoaders: [
        {
          // Eslint loader
          test: /\.(js|jsx)$/,
          loader: 'eslint-loader',
          exclude: [nodeModulesDir],
        },
      ],
    },
  };

  return _.merge({}, config, thisConfig);
};
