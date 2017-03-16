const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  devtool: 'source-map',
  resolve: {
    extensions: ['.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: /.less$/,
        loader: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
      { test: /\.hbs$/, 
        loader: "handlebars-loader" 
      }
    ]
  },
    resolve: {
      alias: {
        handlebars: 'handlebars/dist/handlebars.min.js'
      }
  },
    devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 3000,
    hot: true,
    lazy: false
  },
  plugins: [new HtmlWebpackPlugin({
    title: "Stensul Test App - Ezequiel Lerman",
    template: 'index.html',
    filename: 'index.html'
  }),
  new webpack.HotModuleReplacementPlugin(),
  new CleanWebpackPlugin(['dist'])]
};
