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
  config.module.rules.push({
    test: /\.tsx?$/,
    include: path.resolve(__dirname, "../src"),
    use: [
      require.resolve("ts-loader"),
      {
        loader: require.resolve("react-docgen-typescript-loader"),
        options: {
          // Provide the path to your tsconfig.json so that your stories can
          // display types from outside each individual story.
          tsconfigPath: path.resolve(__dirname, "../tsconfig.json"),
        },
      },
    ],
  });
  config.resolve.extensions.push('.ts', '.tsx');
  config.resolve.alias = {
    components: path.resolve(__dirname, '../src/components'),
    hooks: path.resolve(__dirname, '../src/hooks'),
    visualizations: path.resolve(__dirname, '../src/visualizations')
  };
  return config
};
