import Router from 'koa-router';

import indexCtrl from '../controllers/indexCtrl';

const router = new Router();

export default (app) => {
  router.get('*', indexCtrl.index);

  app
    .use(router.routes())
    .use(router.allowedMethods());
};
