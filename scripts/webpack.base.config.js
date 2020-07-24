/**
 * @see: https://www.webpackjs.com/configuration/#%E9%80%89%E9%A1%B9
 */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack')

// relative the node start project
const resolveApp = relativePath => path.resolve(process.cwd(), relativePath);

module.exports = env => {
  const isDevelopment = env === 'development'

  return {
    mode: env,
    entry: {
      app: './src/main.ts',
    },
    output: {
      // entry.app 名字
      filename:  isDevelopment ? 'static/js/[name].bundle.js' : 'static/js/[name].[contenthash:8].bundle.js',
      // 源码文件 或 /* webpackChunkName: "***" */
      chunkFilename: isDevelopment ? 'static/js/[name].chunk.js' : 'static/js/[name].[contenthash:8].chunk.js',
      path: resolveApp('./dist')
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    module: {
      rules: [
        {
          // https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD-css
          test: /\.(sa|sc|c)ss$/,
          use:[
            // 添加到 style 标签上，https://www.webpackjs.com/loaders/style-loader/
            isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader, // 开发环境下 直接使用MiniCssExtractPlugin.loader 无法进行 hmr 热更新
            'css-loader',   // 导入css 文件，https://www.webpackjs.com/loaders/css-loader/
            // 'postcss-loader',
            // 'sass-loader',
          ]
        },
        {
          // 生成文件 file.png，添加到output/dist目录并返回 public URL替换对应位置内容
          // https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD%E5%9B%BE%E7%89%87
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            {
              loader: 'file-loader',   // https://www.webpackjs.com/loaders/file-loader/
              options: {
                name: 'static/images/[name].[hash:8].[ext]',
              }
            }
          ],
        },
        {
          // 处理字体文件的加载，如阿里的iconfont
          // https://www.webpackjs.com/guides/asset-management/#%E5%8A%A0%E8%BD%BD%E5%AD%97%E4%BD%93
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'static/fonts/[name].[hash:8].[ext]',
              }
            }
          ],
        },
        // https://v4.webpack.docschina.org/guides/typescript/
        {
          test: /\.tsx?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                experimentalWatchApi: true,
              },
            },
          ],
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(isDevelopment ? 'development' : 'production')
      }),
    ],
  }
}
