const webpackConfig = require('../webpack.config')

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  webpackFinal: config => {
    return {
      ...config,
      module: {
        ...config.module,
        rules: [
          {
            test: /.*\/node_modules\/xterm\/.*\.css/,
            use: 'ignore-loader'
          },
          ...config.module.rules,
          ...webpackConfig.module.rules
        ]
      },
      resolve: {
        ...config.resolve,
        ...webpackConfig.resolve
      },
      plugins: [...config.plugins, ...webpackConfig.plugins],
      stats: 'minimal'
    }
  }
}
