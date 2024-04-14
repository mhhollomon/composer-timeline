const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
      index : './src/index.js',
    },

    output: {
        assetModuleFilename: "[name]-[chunkhash][ext]",
        filename: '[name]-[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        clean : true,
    },

    devServer: {
      host : 'localhost',
      port : 9987,
    },

    module: {
        rules: [
          {
            test: /\.css$/i,
            type: 'asset/resource',
            generator : {
              filename: "[name]-[contenthash][ext]",
            }
          },
          {
            test: /\.css$/i,
            use: ['extract-loader', 'css-loader'],
          },
          {
            test: /\.html$/i,
            use: ['html-loader'],
          },
        ],
    },
    plugins : [
      new HtmlWebpackPlugin({ template : "src/index.html"})
    ]
 };
