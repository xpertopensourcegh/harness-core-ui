/* eslint-disable @typescript-eslint/no-var-requires, no-console  */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CircularDependencyPlugin = require('circular-dependency-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const JSONGeneratorPlugin = require('@wings-software/jarvis/lib/webpack/json-generator-plugin').default

const DEV = process.env.NODE_ENV === 'development'
const CONTEXT = process.cwd()

const config = {
  context: CONTEXT,
  entry: './src/framework/app/App.tsx',
  target: 'web',
  mode: DEV ? 'development' : 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: DEV ? 'static/[name].js' : 'static/[name].[contenthash:6].js',
    chunkFilename: DEV ? 'static/[name].[id].js' : 'static/[name].[id].[contenthash:6].js'
  },
  devtool: DEV ? 'cheap-module-source-map' : 'none',
  devServer: {
    contentBase: false,
    port: 8181,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certificates/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificates/localhost.pem'))
    },
    proxy: {
      '/ng/api': {
        logLevel: 'info',
        target: 'http://localhost:7457',
        pathRewrite: { '^/ng/api': '' }
      },
      '/api': {
        logLevel: 'info',
        target: 'https://localhost:9090',
        secure: false
        // add `changeOrigin` when pointing to anything other than local
        // changeOrigin: true
      },
      '/cv-nextgen': {
        logLevel: 'info',
        target: 'https://localhost:6060',
        secure: false
      }
    },
    stats: {
      children: false,
      maxModules: 0,
      chunks: false,
      assets: false,
      modules: false
    }
  },
  watchOptions: {
    ignored: /node_modules/
  },
  stats: {
    modules: false,
    children: false
  },
  module: {
    rules: [
      {
        test: /\.mjs$/,
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
            loader: '@wings-software/css-types-loader',
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
                localIdentName: DEV ? '[name]_[local]_[hash:base64:6]' : '[hash:base64:6]'
              },
              localsConvention: 'camelCaseOnly'
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
        test: /\.(jpg|jpeg|png|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 2000,
              fallback: 'file-loader'
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.ttf$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.json', '.ttf'],
    plugins: [new TsconfigPathsPlugin()]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
}

const commonPlugins = [
  new MiniCssExtractPlugin({
    filename: DEV ? 'static/[name].css' : 'static/[name].[contenthash:6].css',
    chunkFilename: DEV ? 'static/[name].[id].css' : 'static/[name].[id].[contenthash:6].css'
  }),
  new HTMLWebpackPlugin({
    template: 'src/index.html',
    filename: 'index.html',
    minify: false
  }),
  new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
  new webpack.DefinePlugin({
    __DEV__: DEV
  })
]

const devOnlyPlugins = [
  new ForkTsCheckerWebpackPlugin({ tsconfig: 'tsconfig.json' }),
  new CircularDependencyPlugin({
    exclude: /node_modules/,
    failOnError: true
  })
  // new BundleAnalyzerPlugin()
]

const prodOnlyPlugins = [
  new JSONGeneratorPlugin({
    content: {
      version: require('./package.json').version,
      gitCommit: process.env.GIT_COMMIT,
      gitBranch: process.env.GIT_BRANCH
    },
    filename: 'static/version.json'
  })
]

config.plugins = commonPlugins.concat(DEV ? devOnlyPlugins : prodOnlyPlugins)

console.log({ DEV, FsEvents: process.env.TSC_WATCHFILE === 'UseFsEvents' })

module.exports = config
