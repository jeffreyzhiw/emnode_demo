import http from 'http';

import { app, initApp } from './appServer';

import globalConfig from '../../../global.config';

//import frontDevMiddleware from './middlewares/front-dev-middleware';

/**
 * webpack 的 webpack-dev-middleware 配置 - for development
 */
//frontDevMiddleware(app);

/**
 * Init App
 */
initApp(app);

/**
 * Start Server - for development
 */
const server = http.createServer();
let tmpApp = app.callback();
server.on('request', tmpApp);
//destroyable(server);
server.listen(globalConfig.app.port, () => {
  console.log(`Server started, listening on port: ${globalConfig.app.port}`);
  console.log(`Environment: ${globalConfig.app.env}\n`);
});

export default server;

// check if HMR is enabled
if (module.hot) {
  // accept update of dependency
  module.hot.accept();
  module.hot.accept('./appServer', () => {
    let hotApp = null;
    try {
      hotApp = require('./appServer').app;
      //frontDevMiddleware(hotApp);
      require('./appServer').initApp(hotApp);
    } catch (err) {
      console.error(err.stack);
      return;
    }
    server.removeListener('request', tmpApp);
    tmpApp = hotApp.callback();
    server.on('request', tmpApp);
  });
}
