const path = require('path')
const webpack = require('webpack')
const slsw = require('serverless-webpack')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
module.exports = {
	mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
	devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'cheap-source-map',
	entry: slsw.lib.entries,
	target: 'node',
	resolve: {
		extensions: ['.cjs', '.mjs', '.js', '.ts'],
		plugins: [new TsconfigPathsPlugin()]
	},
	output: {
		libraryTarget: 'commonjs2',
		path: path.join(__dirname, '.webpack'),
		filename: '[name].js'
	},
	externals: ['aws-sdk', 'aws-lambda'],
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				exclude: [[path.resolve(__dirname, '.webpack'), path.resolve(__dirname, '.serverless')]],
				options: {
					transpileOnly: true,
					experimentalFileCaching: true
				}
			}
		]
	},
	plugins: [new ForkTsCheckerWebpackPlugin(), new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })]
}
