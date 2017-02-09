'use strict';

import gulp from 'gulp';
import { spawn } from 'child_process';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import fs from 'fs';
import path from 'path';
import del from 'del';
import yargs from 'yargs';
import ava from 'gulp-ava';

import globalConfig from './global.config';
import clientConfigGenerator from './webpack/webpack.client.config';
import serverConfigGenerator from './webpack/webpack.server.config';

const argv = yargs
  .alias('t', 'table')
  .alias('c', 'collection')
  .argv;
  
/**
 * 开发环境构建任务集合
 */
gulp.task('dev:client', devClient);                // 开发环境构建任务：客户端构建
gulp.task('dev:server', devServer);                // 开发环境构建任务：服务端构建
gulp.task('dev', ['dev:server'], runServer);           // 开发环境构建任务

/**
 * 生产环境构建任务集合
 */
gulp.task('prod:client', prodClient);                // 生产环境构建任务：客户端构建
gulp.task('prod:server', prodServer);                // 生产环境构建任务：客户端构建
gulp.task('build', ['prod:client', 'prod:server']);  // 生产环境构建任务
gulp.task('prod', ['prod:client', 'prod:server'], runServer); // 生产环境构建任务

/**
 * 清理 build 文件夹
 */
function clean(done) {
  // 删除 build 文件夹
  del(['build']);

  // 新建并拷贝 global.config.js 文件
  gulp
    .src('./global.config.js')
    .pipe(gulp.dest('build'));
}

/**
 * 前端打包任务 - for development
 */
// function devClient(done) {
//   let config = clientConfigGenerator({ debug: true });
//   webpack( config ).run( onBuild(done) );
// }
function devClient(done) {
  let config = clientConfigGenerator({ debug: true });
  new WebpackDevServer(webpack( config ), config.devServer)
    .listen(globalConfig.devServer.port);
}

/**
 * 前端打包任务 - for production
 */
function prodClient(done) {
  let config = clientConfigGenerator({});
  webpack( config ).run( onBuild(done) );
}

/**
 * 后端打包任务 - for development
 */
function devServer(done) {
  let config = serverConfigGenerator({ debug: true });

  let firedDone = false;
  webpack( config ).watch({
    aggregateTimeout: 300, // wait so long for more changes
    poll: true,
  }, (err, stats) => {
    onBuild()(err, stats);

    if (!firedDone) {
      done();
      firedDone = true;
    }
  });
}

/**
 * 后端打包任务 - for production
 */
function prodServer(done) {
  let config = serverConfigGenerator({});
  webpack( config ).run( onBuild(done) );
}

/**
 * 项目启动任务
 */
function runServer() {
  const serverNames = fs.readdirSync(globalConfig.app.serverPath)
    .filter((file) => ['.DS_Store', 'common'].indexOf(file) === -1 )
    .filter( (entry) => {
      const entryFile = fs.readdirSync(path.resolve(globalConfig.app.serverPath, entry))
        .filter( (file) => file === `${entry}Server.js`);
      return entryFile.length > 0;
    });

  for (const serverName of serverNames) {
    const entry = process.env.NODE_ENV === 'production'
      ? `./build/server/${serverName}.min.js`
      : `./build/server/${serverName}.js`;

    const server = spawn('node', [ entry ]);
    server.stdout.on('data', (data) => process.stdout.write(data));
    server.stderr.on('data', (data) => process.stderr.write(data));
    server.on('exit', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  }
}

function runTests(done) {
  gulp
    .src(globalConfig.testPaths)
    .pipe(ava());
}

/**
 * webpack 构建过程的控制台日志显示
 */
function onBuild(done) {
  return (err, stats) => {
    if (err) {
      console.log( 'Error', err );
    } else {
      console.log( '\n[webpack]', stats.toString({
        cached: false,
        cachedAssets: false,
        colors: true,
        exclude: ['node_modules'],
      }) );
    }
    if (done) {
      done();
    }
  };
}

/**
 * 参数解析
 */
function handleArgv(argv) {
  const defaultRes = { base: false, finance: false, trading: false,
    zone: false, drop: false };
  let { base, finance, trading, zone, drop, modelNames } = argv;
  const zoneCode = zone ? zone.collection.split(',') : undefined;
  modelNames = modelNames ? modelNames.collection.split(',') : undefined;

  if (!base && !finance && !trading && !zone) {
    return { base: true, finance: true, trading: true, zone: true, drop: false };
  }

  return Object.assign(defaultRes, argv, { zoneCode, modelNames });
}
