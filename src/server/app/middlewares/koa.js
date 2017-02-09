import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import session from 'koa-generic-session';
import MongoStore from 'koa-generic-session-mongo';
import path from 'path';
import serve from 'koa-static-cache';
import views from 'co-view';

import config from '../../../../global.config';

const STATIC_FILES_MAP = {};
const SERVE_OPTIONS = { prefix: config.app.publicPath, maxAge: 365 * 24 * 60 * 60 };

export default function (app) {
  if (!config.app.keys) {
    throw new Error('Please add session secret key in the config file!');
  }
  app.keys = config.app.keys;

  /**
   * 全局超时控制
   */
  app.use(function* setTimeout(next) {
    this.req.setTimeout(0);
    yield next;
  });

  if (config.app.env === 'production') {
    app.use(serve(path.resolve(config.app.outputPath, 'client'), SERVE_OPTIONS, STATIC_FILES_MAP));
  }

  app.use(function* templateRender(next) {
    const indexPath = config.app.env === 'production'
      ? config.app.outputPath
      : path.resolve(config.app.appPath, 'templates');

    this.render = views(indexPath, {
      map: { html: 'swig' },
      cache: config.app.env === 'development' ? 'memory' : false,
    });
    yield next;
  });

  app.use(bodyParser());
}
