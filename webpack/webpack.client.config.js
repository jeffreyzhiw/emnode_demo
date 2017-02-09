import _ from 'lodash';
import path from 'path';
import webpack from 'webpack';
import fs from 'fs';

import globalConfig from '../global.config';
import strategiesGenerator from './strategies';

const strategies = strategiesGenerator('client');

// 默认参数配置
const defaultOptions = {
  debug: false,
};

export default (options) => {
  const thisOptions = _.merge({}, defaultOptions, options);

  const debug = thisOptions.debug !== undefined ? thisOptions.debug : false;

  // 前端多入口文件
  const clientEntries = fs.readdirSync(globalConfig.app.clientPath)
    .filter((file) => ['.DS_Store', 'common'].indexOf(file) === -1 )
    .reduce((entries, entry) => {
      return Object.assign(entries, {
        [entry]: [path.resolve(globalConfig.app.clientPath, entry, 'app.jsx')],
      });
    }, {});

  const publicPathPrefix = debug
    ? `${globalConfig.devServer.host}:${globalConfig.devServer.port}`
    : '';
  const publicPath = `${publicPathPrefix}${globalConfig.app.publicPath}`;

  const config = {
    // The base directory (absolute path!) for resolving the entry option.
    context: globalConfig.app.clientPath,
    // 入口文件
    entry: clientEntries,
    // entry: Object.assign(clientEntries, {
    //   vendor: ['react', 'react-dom', 'react-router', 'material-ui',
    //     'antd', 'history', 'moment', 'react-redux', 'react-router-redux',
    //     'react-tap-event-plugin', 'react-router', 'react-paginate'],
    // }),

    output: {
      // 打包文件路径
      path: globalConfig.app.clientOutputPath,
      // 网站运行时打包文件的访问路径
      publicPath: publicPath,
      // 打包文件名称
      filename: debug ? '[name].js' : '[name].min.js',
      // The filename of non-entry chunks
      chunkFilename: debug ? '[name].chunk.js' : '[chunkhash:8].[name].chunk.min.js',
      // 热更新 chunks 文件名称
      //hotUpdateChunkFilename: debug ? '[id].js' : '[id].[chunkhash:8].min.js',
      // The filename of the SourceMaps for the JavaScript files.
      sourceMapFilename: 'debugging/[file].map',
    },

    devtool: debug ? 'cheap-module-eval-source-map' : 'source-map',

    debug: debug ? true : false,

    module: {
      loaders: [
        { test: /\.css/, loader: 'style!css' },
        { test: /\.less/, loader: 'style!css!less' },
        { test: /\.json/, loader: 'json' },
        { test: /\.(woff|woff2)/, loader: 'url?limit=100000' },
        { test: /\.(png|jpg|jpeg|gif|svg)/, loader: 'url?limit=100000' },
        { test: /\.(ttf|eot)/, loader: 'file' },
        {
          test: /\.(js|jsx)$/,
          loader: 'babel',
          exclude: [globalConfig.app.nodeModulesPath, `${process.cwd()}/src/client/common/libs`],
          query: {
            presets: ['react', 'es2015', 'stage-2'],
            babelrc: false,
            env: {
              development: {
                plugins: [
                  ['react-transform', {
                    transforms: [{
                      transform: 'react-transform-hmr',
                      imports: ['react'],
                      locals: ['module'],
                    }, {
                      transform: 'react-transform-catch-errors',
                      imports: ['react', 'redbox-react'],
                    }]
                  }]
                ]
              },
            },
          },
        },
      ]
    },

    // 查找依赖文件配置
    resolve: {
      extensions: ['', '.js', '.jsx', '.css', '.png', '.jpg'], // 自动补全识别后缀
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(debug ? 'development' : 'production'),
        },
      }),
    ]
  };

  return strategies.reduce((conf, strategy) => {
    return strategy(conf, thisOptions);
  }, config);
};
