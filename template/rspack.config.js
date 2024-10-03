const rspack = require("@rspack/core");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
  },
  mode: isProduction ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(tsx?|jsx?)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-typescript"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { legacy: true }],
              "@babel/plugin-transform-class-properties",
              "@babel/plugin-syntax-dynamic-import",
              [
                "transform-define",
                {
                  "process.env.LIT_DEV_MODE": "'false'",
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          rspack.CssExtractRspackPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 50000,
      cacheGroups: {
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
          priority: -10,
        },
      },
    },
    runtimeChunk: "single",
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        extractComments: false,
      }),
    ],
    sideEffects: true,
    usedExports: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      filename: "index.html",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      },
    }),
    new rspack.CssExtractRspackPlugin({
      filename: "[name].[contenthash].css",
    }),
    new CompressionPlugin({
      filename: "[name].[contenthash].js.gz",
      algorithm: "gzip",
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/",
    },
    compress: true,
    port: 9000,
    hot: true,
    liveReload: true,
    watchFiles: ["src/**/*"],
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: true,
    },
  },
};
