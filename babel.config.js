module.exports = function (api) {
  api.cache(true);

  const presets = ["@babel/preset-env", "@babel/preset-react"];
  const plugins = ["@babel/plugin-transform-async-to-generator"];

  const overrides = [
    {
      compact: true,
    },
  ];

  return {
    presets,
    overrides,
    plugins,
  };
};
