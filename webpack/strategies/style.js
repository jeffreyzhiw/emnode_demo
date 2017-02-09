import ExtractTextPlugin, { extract } from 'extract-text-webpack-plugin';

export default (config, options) => {
  const thisConfig = config;

  const stylesheetLoaders = [
    { test: /\.css/, loader: 'css' },
    // { test: /\.less/, loader: 'css!less' },
  ];

  const loaders = [];
  for (const loader of stylesheetLoaders) {
    if (options.prerender) {
      loader.loader = 'null';
    } else if (options.debug) {
      loader.loader = extract('style', loader.loader);
    } else {
      loader.loader = `style!${loader.loader}`;
    }
    loaders.push(loader);
  }


  thisConfig.module.loaders = thisConfig.module.loaders.concat(loaders);

  if (options.separateStylesheet) {
    thisConfig.plugins.push(new ExtractTextPlugin('[name].css'));
  }
  return thisConfig;
};
