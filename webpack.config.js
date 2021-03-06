const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const publicPath = process.env.PUBLIC_URL || '/';

module.exports = {
  mode: 'development',
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'app.js',
    publicPath,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              publicPath: '.',
              name: '[name].[ext]?[hash]',
              limit: 10000,
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      base: publicPath,
      title: 'Lemon Presentation🍋',
      filename: 'index.html',
      template: './public/index.html',
    }),
    new HtmlWebpackPlugin({
      filename: 'popup.html',
      template: './public/popup.html',
      inject: false,
    }),
  ],
};

