const webpackConfig = require('../webpack.config')
const cssRule = webpackConfig.module.rules[0]
const path = require('path')

module.exports = ({ config }) => {
  config.module.rules = [
    // replace mini-css-extract-plugin with style-loader
    {
      test: /\.css$/,
      use: ['style-loader', ...cssRule.use.slice(1)]
    },
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader']
    },
    ...webpackConfig.module.rules.slice(1)
  ];
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = {
    components: path.resolve(__dirname, '../src/components')
  };
  return config
};
