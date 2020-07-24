const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const webpack = require('webpack')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const webpackConfig = merge(baseConfig('production'), {
  devtool: 'source-map',
  plugins: [
    // 清理 dist 内容
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // 分离并提取css
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].bundle.css',
      chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
    }),

    // 如：当js代码改变时，使每次构建保证其它chunk哈希不变，如style、第三方库等
    new webpack.HashedModuleIdsPlugin(),

    // 分析 bundle 内容的插件及 CLI 工具
    /*new BundleAnalyzerPlugin({
      analyzerHost: 'localhost',
      analyzerPort: 8888,
      openAnalyzer: false, // 构建时，是否打开浏览器
    }),*/
  ],

  // 不同环境的默认配置：https://webpack.js.org/configuration/mode/
  optimization: {
    // 代码压缩
    minimize: false,
    minimizer: [
      // 默认使用 TerserPlugin
      new TerserPlugin({
        sourceMap: true, // 默认 true
      }),
      // 压缩优化css
      new OptimizeCSSAssetsPlugin()
    ],

    // 提取引到模板：分离提取 webpack runtime 代码bundle 与项目源码入口的chunk
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    },
    // 分离提取项目代码
    // https://v4.webpack.docschina.org/plugins/split-chunks-plugin/
    splitChunks: {
      cacheGroups: {
        // 'all' 提取第三方库到公共位置 vendors.chunk.js 文件中去
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        }
      },
    },
  },

  // 关闭打包性能提示：如文件大小超过限制
  performance: false,
  // 构建提示
  stats: {
    hash: true, // 编译的哈希值
    builtAt: true, // 显示编译日期
    assets: true, // 显示编译资源列表
    entrypoints: true, // 显示编译入口
    modules: false, // 关闭 构建模块信息列表
    children: false, // 关闭 children 编译资源列表
    errors: true, // 错误信息
    errorDetails: true,
    warnings: true, // 警告信息
  },
})

module.exports = webpackConfig
