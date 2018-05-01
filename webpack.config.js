const path = require("path");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const ROOT_DIR = path.resolve(__dirname, "..");
const SOURCE_DIR = path.join(__dirname, "dist");

const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);

const SRC_DIR = resolvePath("src");
const reStyle = /\.(css|less)$/;
const reScript = /\.(js|jsx)$/;
const port = 9000;

const minimizeCssOptions = {
  discardComments: { removeAll: true }
};

module.exports = (env, options) => {
  const isProduct = options.mode === "production";
  return {
    // entry: [
    //   "webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000",
    //   "./src/index.js"
    // ],
    output: {
      path: SOURCE_DIR,
      filename: "[name].js",
      publicPath: isProduct ? "/" : `http://localhost:${port}/`
    },

    module: {
      rules: [
        {
          test: reScript,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              babelrc: true
            }
          }
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]
        },

        // Rules for Style Sheets
        {
          test: reStyle,
          rules: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              include: /node_modules/,
              loader: "css-loader",
              options: {
                sourceMap: !isProduct,
                minimize: isProduct ? minimizeCssOptions : false
              }
            },
            {
              exclude: /node_modules/,
              loader: "css-loader",
              options: {
                importLoaders: 2,
                sourceMap: !isProduct,
                modules: true,
                localIdentName: !isProduct
                  ? "[name]-[local]-[hash:base64:5]"
                  : "[hash:base64:5]",
                minimize: isProduct ? minimizeCssOptions : false
              }
            },
            {
              loader: "postcss-loader",
              options: {
                plugins: [autoprefixer()]
              }
            },
            {
              loader: "less-loader"
            }
          ]
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(["dist"]),
      new webpack.DefinePlugin({
        SERVICE_URL: JSON.stringify(isProduct ? "production" : "development"),
        isProduct: JSON.stringify(isProduct)
      }),
      new HtmlWebPackPlugin({
        template: "./src/index.html",
        filename: "./index.html"
      }),
      new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    devServer: {
      contentBase: SOURCE_DIR,
      historyApiFallback: true,
      compress: true,
      hot: true,
      port
    }
  };
};
