import globalConfig from '../../../../global.config';

function* index(next) {
  const MINIMUM_NAME = `${globalConfig.app.env === 'production' ? '.min' : ''}`;
  const HOST = globalConfig.app.env === 'production'
    ? ''
    : `${globalConfig.devServer.host}:${globalConfig.devServer.port}`;
  const SCRIPT_URL = `${HOST}${globalConfig.app.publicPath}app${MINIMUM_NAME}.js`;
  const VENDOR_URL = `${HOST}${globalConfig.app.publicPath}vendor.bundle.js`;
  this.body = yield this.render('index', { SCRIPT_URL, VENDOR_URL });
}

export default {
  index,
};
