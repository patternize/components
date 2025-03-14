module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
  ],

  framework: "@storybook/react-webpack5",

  docs: {},

  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
};
