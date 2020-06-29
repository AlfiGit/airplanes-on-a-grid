const webpack = require('webpack')

module.exports = {
    mode: "development",
	entry: ['babel-polyfill', 'react-hot-loader/patch', 'webpack-hot-middleware/client', './js/index.jsx'],
	module: {
		rules: [
			{ test: /\.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.css$/, loader: ['style-loader', 'css-loader'] }
		]
	},
	devtool: 'inline-source-map',
	output: {
		filename: 'bundle.js',
		path: __dirname + '/public',
		libraryTarget: 'umd'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	]
} 
