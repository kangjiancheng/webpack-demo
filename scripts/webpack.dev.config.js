const path = require('path');
const webpack = require('webpack')
const portfinder = require('portfinder')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const resolveApp = relativePath => path.resolve(process.cwd(), relativePath);

const webpackConfig = merge(baseConfig('development'), {
  devServer: {
    contentBase: resolveApp("./dist"), // 非webpack的内容目录
    hot: true, // 模块热更新
    proxy: { // // 代理接口请求
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {'^/api' : ''}
      }
    },
    host: '127.0.0.1',
    port: 8090,
    open: false, // 是否自动打开浏览器
    overlay: {  // 在浏览器中显示编译警告和错误
      warnings: true,
      errors: true
    },
    quiet: false, // true: 除了初始启动信息之外的任何内容都不会被打印到控制台
    clientLogLevel: 'info',
    watchOptions: {
      poll: true,
    }
  },
  // https://www.webpackjs.com/configuration/devtool/
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    // html 文件自动注入js入口
    new HtmlWebpackPlugin({
      template: 'public/index.html',
    }),

    // 模块热替换 HMR 在浏览器控制台中查看模块更新跟踪记录
    // https://www.webpackjs.com/guides/hot-module-replacement/#%E5%90%AF%E7%94%A8-hmr
    new webpack.HotModuleReplacementPlugin(),
  ],
  stats: {
    all: false, // 设置所有默认值为false
    errors: true, // 错误信息
    errorDetails: true,
    warnings: true, // 警告信息
    colors: true,
  }
})

// 优化配置
function optimizeConfig () {
  return
}

module.exports = new Promise((resolve, reject) => {
  // 解决端口冲突
  portfinder.basePort = process.env.PORT || webpackConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) reject(err)
    else {
      process.env.PORT = port
      webpackConfig.devServer.port = port

      // 优化webpack编译在控制台中的错误和警告提示
    }
  })
})


module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || webpackConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      webpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      // webpackConfig.plugins.push(new FriendlyErrorsPlugin({
      //   compilationSuccessInfo: {
      //     messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
      //   },
      //   onErrors: config.dev.notifyOnErrors
      //     ? utils.createNotifierCallback()
      //     : undefined
      // }))

      resolve(webpackConfig)
    }
  })
})
// module.exports = webpackConfig
