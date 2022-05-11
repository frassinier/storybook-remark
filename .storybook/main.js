const groupRemarkPlugin = require("./remark/group");

module.exports = {
  stories: [
    "../stories/**/*.stories.mdx",
    "../stories/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    builder: "@storybook/builder-webpack5",
  },
  webpackFinal: async (config) => {
    config.module.rules.map((rule) => {
      if (rule.use?.some((use) => use.loader?.includes("@mdx-js"))) {
        return rule.use.map((use) => {
          if (use.options?.remarkPlugins) {
            use.options.remarkPlugins.push(groupRemarkPlugin);
          }
          return use;
        });
      }
      return rule;
    });
    return config;
  },
};
