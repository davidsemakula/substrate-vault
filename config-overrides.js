function getLoader(config, loaderFilter) {
  // Inspired by https://github.com/arackaf/customize-cra/blob/master/src/utilities.js#L13 but generalized
  // Try to find the loader inside the oneOf array.
  let loaders = config.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;
  let loader = loaders.find(loaderFilter);

  // If the loader was not found, try to find it inside the "use" array, within the rules.
  if (!loader) {
    loaders = loaders.reduce((ldrs, rule) => ldrs.concat(rule.use || []), []);
    loader = loaders.find(loaderFilter);
  }
  return loader;
}

module.exports = function override(config, env) {
  // Fixes resolving packages of `"type": "module"`
  // https://github.com/react-dnd/react-dnd/issues/3425
  // https://github.com/microsoft/PowerBI-visuals-tools/issues/365#issuecomment-1099716186
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false
    }
  });

  // Enable SVGO for @svgr/webpack to clean up svg namespace issues
  // https://react-svgr.com/docs/configuration-files/#svgo
  // https://react-svgr.com/docs/options/#svgo
  // Solves "Namespace tags are not supported by default. React's JSX doesn't support namespace tags. You can set `throwIfNamespace: false` to bypass this warning." error
  // from `@babel/preset` https://babeljs.io/docs/en/babel-preset-react#throwifnamespace
  // Option chosen over enabling namespaces as React doesn't support these tags anyway and standard SVG should be enough for browser rendering
  let svgLoader = getLoader(config, rule => rule.loader && rule.loader.includes('@svgr/webpack'));
  if(svgLoader) {
    svgLoader.options = {
      ...svgLoader.options,
      svgo: true,
    };
  }

  return config;
}