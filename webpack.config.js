const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
console.log("process.env.NODE_ENV=", process.env.NODE_ENV); // 打印环境变量

const config = {
  entry: "./src/index.js", // 打包入口地址
  output: {
    filename: "bundle.js", // 输出文件名
    path: path.join(__dirname, "dist"), // 输出文件目录
  },
  module: {
    rules: [
      {
        test: /\.(s[ac]|c)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [ 
          MiniCssExtractPlugin.loader, // 添加 loader
          // ,"style-loader",
          "css-loader", 
          'postcss-loader',
          'sass-loader'
        ], // use: 对应的 Loader 名称
      },
      // {
      //   test: /\.(jpe?g|png|gif)$/i,
      //   type: 'javascript/auto', //webpack5 的配置
      //   loader: 'file-loader',
      //   options: {
      //     esModule: false, //解决html区域,vue模板引入图片路径问题
      //     limit: 1000,
      //     name: "[name].[hash:8].[ext]",
      //   }
      // },
      // base64
      // {
      //   test: /\.(jpe?g|png|gif)$/i,
      //   type: 'javascript/auto', //webpack5 的配置
      //   use:[
      //     {
      //       loader: 'url-loader',
      //       options: {
      //         esModule: false,
      //         name: '[name][hash:8].[ext]',
      //         // 文件小于 50k 会转换为 base64，大于则拷贝文件
      //         limit: 50 * 1024
      //       }
      //     }
      //   ]
      // },
      //webpack5
      {
        test: /\.(jpe?g|png|gif)$/i,
        type: 'asset',
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]"
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024 //超过50kb不转 base64
          }
        }
      },
      //file-loader  引用文件 url()
      // url-loader 引用文件 url() 转成 base64 
      // img-loader 压缩图片
      // css-loader  webpack默认支持 js json 支持css需要css-loader
      // style-loader 样式加载到html
      // postcss-loader 兼容性
      // sass-loader scss

    ],
  },
  plugins: [
    
    // 配置插件
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin({ // 添加插件
      filename: '[name].[hash:8].css'
    }),
  ],
  devServer: {
    // 因为 webpack 在进行打包的时候，对静态文件的处理，例如图片，
    // 都是直接 copy 到 dist 目录下面。但是对于本地开发来说，这个过程太费时，
    // 也没有必要，所以在设置 contentBase 之后，就直接到对应的静态目录下面去读取文件，
    // 而不需对文件做任何移动，节省了时间和性能开销。
    contentBase: path.resolve(__dirname, "public"), // 静态文件目录
    compress: true, //是否启动压缩 gzip
    port: 8080, // 端口号
    // open:true  // 是否自动打开浏览器
  },
};

module.exports = (env, argv) => {
  console.log("argv.mode=", argv.mode); // 打印 mode(模式) 值
  // 这里可以通过不同的模式修改 config 配置
  return config;
};
