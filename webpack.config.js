/* eslint-disable @typescript-eslint/no-var-requires, no-console  */
const webpack = require('webpack')
const path = require('path')
const fs = require('fs')

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const DEV = process.env.NODE_ENV === 'development'
const CONTEXT = process.cwd()

const config = {
  context: CONTEXT,
  entry: './src/framework/app/app.tsx',
  target: 'web',
  mode: DEV ? 'development' : 'production',
  stats: {
    children: false
  },
  devServer: {
    contentBase: false,
    port: 8181,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, './certificates/localhost-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, './certificates/localhost.pem'))
    }
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: DEV ? 'static/[name].js' : 'static/[name].[contenthash:6].js',
    chunkFilename: DEV ? 'static/[name].[id].js' : 'static/[name].[id].[contenthash:6].js'
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
      }
    ]
  },
  devtool: DEV ? 'cheap-module-source-map' : 'none',
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: DEV ? 'static/[name].css' : 'static/[name].[contenthash:6].css',
      chunkFilename: DEV ? 'static/[name].[id].css' : 'static/[name].[id].[contenthash:6].js'
    }),
    new HTMLWebpackPlugin({
      template: 'src/index.html',
      filename: 'index.html',
      showErrors: false,
      minify: false
    }),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/)
    // new BundleAnalyzerPlugin()
  ]
}

if (DEV) {
  config.plugins.concat([new ForkTsCheckerWebpackPlugin({ tsconfig: 'tsconfig.json' })])
}

module.exports = config
