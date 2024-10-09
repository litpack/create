const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
const rspack = require("@rspack/core");
const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
    clean: true,
    globalObject: "self",
    assetModuleFilename: "assets/[hash][ext][query]",
  },
  
  mode: isProduction ? "production" : "development",
  devtool: isProduction ? false : "source-map",
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/images/[hash][ext][query]",
        },
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
              ["transform-define", { "process.env.LIT_DEV_MODE": "'false'" }],
              "babel-plugin-transform-typescript-metadata"
            ],
          },
        },
      },
      {
        test: /\.css$/i,
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
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      chunks: "all",
      minSize: 20000,
      maxSize: 50000,
      minChunks: 1,
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
        commons: {
          name: "commons",
          minChunks: 2,
          maxInitialRequests: Infinity,
          minSize: 0,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: isProduction,
          },
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    sideEffects: false,
    usedExports: true,
    concatenateModules: true,
    providedExports: true,
    moduleIds: 'deterministic',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body",
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      },
      preload: [".css", ".js"],
    }),
    new rspack.CssExtractRspackPlugin(),
    ...(isProduction
      ? [
          new CompressionPlugin({
            filename: "[name].[contenthash].js.gz",
            algorithm: "gzip",
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          }),
          new CompressionPlugin({
            filename: "[name].[contenthash].js.br",
            algorithm: "brotliCompress",
            test: /\.(js|css|html|svg)$/,
            compressionOptions: { level: 11 },
            threshold: 10240,
            minRatio: 0.8,
          }),
        ]
      : []),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
      publicPath: "/",
    },
    compress: isProduction,
    port: 9000,
    hot: true,
    liveReload: false,
    watchFiles: ["src/**/*"],
    historyApiFallback: true,
    devMiddleware: {
      writeToDisk: false,
    },
  },
  // stats: {
  //   children: true,
  // },
};
