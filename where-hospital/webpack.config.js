const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
module.exports = {
	mode: 'production',
	devtool: 'cheap-source-map',
	entry: './src/app.ts',
	target: 'node',
	resolve: {
		extensions: ['.cjs', '.mjs', '.js', '.ts'],
		plugins: [new TsconfigPathsPlugin()]
	},
	output: {
		libraryTarget: 'commonjs2',
		path: path.resolve(__dirname, '/pack'),
		filename: 'index.js'
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				exclude: [[path.resolve(__dirname, 'pack')]],
				options: {
					transpileOnly: true,
					experimentalFileCaching: true
				}
			}
		]
	},
	plugins: [new ForkTsCheckerWebpackPlugin()]
}
