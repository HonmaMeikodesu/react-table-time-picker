const path = require('path');
const process = require('process');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: path.join(__dirname, 'test/index.html'),
  filename: './index.html',
});

module.exports = {
  entry: process.env.NODE_ENV === 'dev' ? path.join(__dirname, 'src/index.jsx') : process.env.NODE_ENV === 'prod' ? path.join(__dirname, 'src/components/index.jsx') : path.join(__dirname, 'src/index.jsx'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 2,
          },
        },
        {
          loader: 'postcss-loader',
        },
        {
          loader: 'less-loader',
        }],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: './images/[name].[ext]',
            limit: 102400,
          },
        }],
      },
    ],
  },
  plugins: process.env.NODE_ENV === 'dev' ? [htmlWebpackPlugin] : [],
  resolve: {
    extensions: ['.js', '.jsx', '.less'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  externals: process.env.NODE_ENV === 'dev' ? {} : {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    moment: 'moment',
  },
  devServer: {
    port: 3001,
  },
};
