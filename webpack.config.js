const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.ts'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'source-map',
  mode: 'production',

  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/,
        loader: 'source-map-loader',
        enforce: 'pre',
        exclude: /node_modules/,
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
            plugins: [['@babel/plugin-proposal-class-properties']],
          },
        },
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, 'public', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],
};
