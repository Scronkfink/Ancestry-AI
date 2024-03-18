const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();

module.exports = {
  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },

  // Rules for processing different file types
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
        ]
      },
    ],
  },
  plugins: [
    // Plugin to dynamically generate an index.html and inject the bundled script
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your HTML file
    }),
    new webpack.DefinePlugin({
      'process.env.REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
      'process.env.JWT_TOKEN': JSON.stringify(process.env.JWT_TOKEN),
      'process.env.DATABASE_KEY': JSON.stringify(process.env.DATABASE_KEY),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080, 
    proxy: {
            "/api" : "http://localhost:3000",
            // "/login" : "http://localhost:3000",
            // "/getConvos" : "http://localhost:3000",
            // "/updateConvos" : "http://localhost:3000",
            // "/deleteConvos" : "http://localhost:3000",
            // "/getconversation" : "http://localhost:3000",
            // "/createNewConvo" : "http://localhost:3000"
            },
  },

//does the .js/.jsx stuff for you on imports
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};