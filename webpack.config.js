const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  ],
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 8080, 
    proxy: { "/convo": "http://localhost:3000",
            "/signup" : "http://localhost:3000",
            "/login" : "http://localhost:3000"
            },
  },

//does the .js/.jsx stuff for you on imports
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};