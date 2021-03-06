import Koa from 'koa';
import http from 'http';

/**
 * Config import
 */
import globalConfig from '../../../global.config';
import koaConfig from './middlewares/koa';
import appAPIs from './middlewares/app.routes';

/**
 * Server
 */
const app = new Koa();

function initApp(app) {
  /**
   * Middlewares
   */
  koaConfig(app);

  /**
   * appAPIs
   */
  appAPIs(app);
}

/**
 * Start Server - for production
 */
if (globalConfig.app.env === 'production') {
  initApp(app);
  const server = http.createServer();
  server.on('request', app.callback());
  server.listen(globalConfig.app.port, () => {
    console.log(`Server started, listening on port: ${globalConfig.app.port}`);
    console.log(`Environment: ${globalConfig.app.env}\n`);
  });
}

export { app, initApp };
