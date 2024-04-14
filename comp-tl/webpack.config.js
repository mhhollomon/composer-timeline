'use strict'

const path = require('path');
const glob = require("glob");
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");

const PATHS = {
  src: path.join(__dirname, "src"),
};

module.exports = {
  mode: 'development',
  entry: './src/js/main.ts',
  output: {
    filename: 'main-[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean : true
  },
  
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "styles",
          test: /\.css$/,
          chunks: "all",
          enforce: true,
        },
      },
    },
  },

  devServer: {
    static: path.resolve(__dirname, 'dist'),
    host : 'localhost',
    port: 9988,
    hot: true
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },  

  plugins: [
    new HtmlWebpackPlugin({ template: './src/index.html' }),
    new miniCssExtractPlugin({filename: '[name]-[contenthash].css'}),
    new PurgeCSSPlugin({
        paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true }),
      }),
  
  ],
  module: {
    rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },

      {
        test: /\.(scss)$/,
        use: [
            miniCssExtractPlugin.loader,
            'css-loader',
            { loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                    plugins: [
                        autoprefixer
                    ]
                    }
                }
            },
            { loader: 'sass-loader' },
        ]
      }
    ]
  }
}