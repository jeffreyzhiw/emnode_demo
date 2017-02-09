require("babel-register")({
  ignore: /node_modules/,
  presets: ["es2015", "stage-3"]
});
require('babel-polyfill');
require('../src/server/server.dev');