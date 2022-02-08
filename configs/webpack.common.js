const path = require('path')

const webpack = require('webpack')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
const ExternalRemotesPlugin = require('external-remotes-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const GenerateStringTypesPlugin = require('../scripts/webpack/GenerateStringTypesPlugin').GenerateStringTypesPlugin
const moduleFederationConfig = require('./modulefederation.config')
const {
  container: { ModuleFederationPlugin }
} = webpack

const CONTEXT = process.cwd()
const ChildAppError = path.resolve(CONTEXT, './src/microfrontends/ChildAppError.tsx')

const enableGitOpsUI = process.env.ENABLE_GITOPSUI === 'true'
const enableSTO = process.env.ENABLE_STO === 'true'
const HARNESS_ENABLE_NG_AUTH_UI = process.env.HARNESS_ENABLE_NG_AUTH_UI !== 'false'

const config = {
  context: CONTEXT,
  entry: path.resolve(CONTEXT, 'src/framework/app/index.tsx'),
  target: 'web',
  stats: {
    modules: false,
    children: false
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ]
      },
      {
        test: /\.module\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: '@harness/css-types-loader',
            options: {
              prettierConfig: CONTEXT
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                mode: 'local',
                localIdentName: '[hash:base64:6]',
                exportLocalsConvention: 'camelCaseOnly'
              }
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.join(CONTEXT, 'src')]
              },
              sourceMap: false,
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /(?<!\.module)\.scss$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: [path.join(CONTEXT, 'src')]
              },
              implementation: require('sass')
            }
          }
        ]
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 2 * 1024 // 2kb
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        include: /node_modules/
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource'
      },
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: [
          {
            loader: 'yaml-loader'
          }
        ]
      },
      {
        test: /\.gql$/,
        type: 'asset/source'
      },
      {
        test: /\.(mp4)$/,
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.json', '.ttf'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(CONTEXT, 'tsconfig.json')
      })
    ],
    alias: {
      '@wings-software': '@harness'
    }
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new ExternalRemotesPlugin(),
    new ModuleFederationPlugin(moduleFederationConfig({ enableGitOpsUI, enableSTO })),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.DefinePlugin({
      'process.env': '{}', // required for @blueprintjs/core
      HARNESS_ENABLE_NG_AUTH_UI
    }),
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json', 'yaml', 'shell', 'powershell']
    }),
    new GenerateStringTypesPlugin()
  ]
}

if (!enableGitOpsUI) {
  // render a mock app when Gitops MF is disabled
  config.resolve.alias['gitopsui/MicroFrontendApp'] = ChildAppError
}

if (!enableSTO) {
  // render a mock app when STO MF is disabled
  config.resolve.alias['sto/App'] = ChildAppError
  config.resolve.alias['sto/PipelineSecurityView'] = ChildAppError
}

module.exports = config