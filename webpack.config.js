const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const htmlWebpackPlugin = new HtmlWebpackPlugin({
	template: path.join(__dirname, 'test/index.html'),
	filename: './index.html',
});
module.exports = {
	entry: path.join(__dirname, 'src/index.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'index.js'
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
					loader: 'style-loader'
				}, {
					loader: 'css-loader',
					options: {
						modules: true,
						importLoaders: 2,			
					}
				},
				{
					loader: 'postcss-loader'
				},
				{
					loader: 'less-loader',
				}],
			},
			{
				test: /\.(png|jp(e*)g|svg|gif)$/,
				use: [
				  {
					loader: 'file-loader',
					options: {
					  name: 'images/[hash]-[name].[ext]',
					},
				  },
				],
			  },
		],
	},
	plugins: [htmlWebpackPlugin],
	resolve: {
		extensions: ['.js', '.jsx', '.less'],
		modules: [path.resolve(__dirname, 'src'), 'node_modules'],
	},
	devServer: {
		port: 3001,
	},
};
