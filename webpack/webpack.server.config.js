'use strict';

import webpack from 'webpack';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import globalConfig from '../global.config';
import strategiesGenerator from './strategies';

const strategies = strategiesGenerator('server');

// 默认参数配置
const defaultOptions = {
    debug: false,
};

export default (options) => {

    options = _.merge({}, defaultOptions, options);

    const debug = options.debug !== undefined ? options.debug : false;

    let nodeModules = {};
    fs.readdirSync(globalConfig.app.nodeModulesPath)
        .filter( (x) => {
            return ['.bin'].indexOf(x) === -1;
        })
        .forEach( (mod) => {
            nodeModules[mod] = 'commonjs ' + mod;
        });

    let externalModules = _.merge(nodeModules/*, {'../../global.config': 'commonjs ../../global.config'}*/);

    // 后端多入口文件
    const serverEntries = fs.readdirSync(globalConfig.app.serverPath)
      .filter((file) => ['.DS_Store', 'common'].indexOf(file) === -1 )
      .filter( (entry) => {
        const entryFile = fs.readdirSync(path.resolve(globalConfig.app.serverPath, entry))
          .filter( (file) => file === `${entry}Server.js`);
        return entryFile.length > 0;
      })
      .reduce((entries, entry) => {
        const modules = [];
        if (globalConfig.app.env === 'development') {
          modules.push('webpack/hot/poll?1000'); // 轮询更新内容的代码
        }
        modules.push('babel-polyfill');
        modules.push(path.resolve(               // 项目入口文件
          globalConfig.app.serverPath,
          entry,
          globalConfig.app.env === 'production' ? `${entry}Server.js` : `${entry}Server.dev.js`
        ));

        return Object.assign(entries, {
          [entry]: modules,
        });
      }, {});

    let config = {
        // The base directory (absolute path!) for resolving the entry option.
        context: globalConfig.app.serverPath,
        // 入口文件
        entry: serverEntries,

        output: {
            // 打包文件路径
            path: globalConfig.app.serverOutputPath,
            // 网站运行时打包文件的访问路径
            publicPath: globalConfig.app.publicPath,
            // 打包文件名称
            filename: debug ? '[name].js' : '[name].min.js',
            // The filename of non-entry chunks
            chunkFilename: debug ? '[name].chunk.js' : '[chunkhash:8].[name].chunk.min.js',
            // 热更新 chunks 文件名称
            //hotUpdateChunkFilename: debug ? '[id].js' : '[id].[chunkhash:8].min.js',
            // The filename of the SourceMaps for the JavaScript files.
            sourceMapFilename: "debugging/[file].map",
        },

        externals: externalModules,

        target: 'node',  // 指明编译方式为 node

        node: {
            __dirname: true,
            __filename: true,
        },

        devtool: debug ? 'inline-source-map' : 'source-map',
        //devtool: debug ? 'cheap-module-eval-source-map' : 'source-map',

        debug: debug ? true : false,

        module: {
            loaders: [
                {
                    test: /\.js$/,
                    exclude: [globalConfig.app.nodeModulesPath],
                    loader: 'babel',
                    query: {
                        babelrc: false,
                        // presets: ["es2015", "stage-3"],
                        plugins: [
                            'transform-es2015-template-literals',
                            'transform-es2015-modules-commonjs',
                            'transform-async-to-generator'
                        ],
                    },
                },
            ],
        },

        plugins: [
            new webpack.IgnorePlugin(/\.(css|less)$/),
            new webpack.BannerPlugin(
                'require("source-map-support").install();',
                { raw: true, entryOnly: false }
            ),
            new webpack.HotModuleReplacementPlugin({ quiet: true }), // 照常启动 hot mode
            new CopyWebpackPlugin([
                { from: './app/templates/index.html', to: '..' },
            ]),
        ],

        // 查找依赖文件配置
        resolve: {
            extensions: ['', '.js'], // 自动补全识别后缀
        },
    };

    return strategies.reduce((conf, strategy) => {
        return strategy(conf, options);
    }, config);
}
