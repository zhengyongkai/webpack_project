const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const webpack = require("webpack");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const PurgecssWebpackPlugin = require("purgecss-webpack-plugin");
const glob = require("glob"); // 文件匹配模式
const PATHS = {
  src: resolve("src"),
};
function resolve(dir) {
  return path.join(__dirname, dir);
}
console.log("process.env.NODE_ENV=", process.env.NODE_ENV); // 打印环境变量

const config = {
  entry: "./src/index.js", // 打包入口地址
  output: {
    filename: "bundle.js", // 输出文件名
    path: path.join(__dirname, "dist"), // 输出文件目录
  },
  // cache 持久化缓存
  cache: {
    type: "filesystem",
  },
  resolve: {
    extensions: [".js", ".json", ".wasm"],
    // 配置别名
    alias: {
      "~": resolve("src"),
      "@": resolve("src"),
      components: resolve("src/components"),
    },
  },
  externals: {
    jquery: "jQuery",
  },
  module: {
    noParse: /jquery|lodash/,
    rules: [
      {
        test: /\.(s[ac]|c|le)ss$/i, //匹配所有的 sass/scss/css 文件
        use: [
          MiniCssExtractPlugin.loader, // 添加 loader
          // ,"style-loader",
          "cache-loader", // 获取前面 loader 转换的结果
          "css-loader",
          "postcss-loader",
          "less-loader",
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
        type: "asset",
        generator: {
          // 输出文件位置以及文件名
          // [ext] 自带 "." 这个与 url-loader 配置不同
          filename: "[name][hash:8][ext]",
        },
        parser: {
          dataUrlCondition: {
            maxSize: 50 * 1024, //超过50kb不转 base64
          },
        },
      },
      {
        test: /\.ks$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "dropConsole",
            options: {
              filename: "banner1",
            },
          },
        ],
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
    new MiniCssExtractPlugin({
      // 添加插件
      filename: "[name].[hash:8].css",
    }),
    // 忽视需要解析的插件
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    // 模块速度插件
    new BundleAnalyzerPlugin({
      analyzerMode: "disabled", // 不启动展示打包报告的http服务器
      // generateStatsFile: true, // 是否生成stats.json文件
    }),
    // 忽略掉需要的插件
    new PurgecssWebpackPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
    }),
  ],
  resolveLoader: {
    modules: ["node_modules", path.resolve(__dirname, "build")],
  },
  optimization: {
    minimize: true,
    minimizer: [
      // 添加 css 压缩配置
      new OptimizeCssAssetsPlugin({}),
      // 对js进行压缩
      new TerserPlugin({}),
    ],
  },
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
