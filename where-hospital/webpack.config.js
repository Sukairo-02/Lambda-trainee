const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const webpack = require('webpack')
module.exports = {
	mode: 'production',
	devtool: 'cheap-source-map',
	entry: path.join(__dirname, '/src/app.ts'),
	target: 'node',
	resolve: {
		extensions: ['.cjs', '.mjs', '.js', '.ts'],
		plugins: [new TsconfigPathsPlugin()]
	},
	output: {
		libraryTarget: 'commonjs2',
		path: path.join(__dirname, '.pack'),
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				exclude: [[path.join(__dirname, '.pack')]],
				options: {
					transpileOnly: true,
					experimentalFileCaching: true
				}
			}
		]
	},
	plugins: [new ForkTsCheckerWebpackPlugin(), new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })]
}
