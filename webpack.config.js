const path = require('path');

const {VueLoaderPlugin} = require('vue-loader');
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.NODE_ENV == "development";

const config = {
	target: 'web',
	entry: path.join(__dirname,'src/index.js'),
	output: {
		filename: 'bundle.[hash:8].js',
		path: path.join(__dirname,'dist')
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					'css-loader'
				]
			},
			{
				test: /\.(gif|jpg|jpeg|png|svg)$/,
				use:[
					{
						loader: 'url-loader',
						options: {
							limit: 1024*13,//13kb
							name: '[name]-loader.[ext]'
						}
					}
				]
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader'
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: isDev ? '"development"':'"production"'
			}
		}),
		new VueLoaderPlugin(),
		new HTMLPlugin(),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[id].css',
			ignoreOrder: false,
		})
	],
	optimization: {
    	splitChunks: {
			chunks (chunk) {
				// exclude `my-excluded-chunk`
				return chunk.name !== 'my-excluded-chunk';
			}
    	}
  	}
}

if(isDev){
	config.module.rules.push({
		test: /\.styl/,
		use: [
			'style-loader',
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true
				}
			},
			'stylus-loader'
		]
	})
	config.devtool = '#cheap-module-eval-source-map',//调试代码映射为本地代码
	config.devServer = {
		port: 5000,
		host: '0.0.0.0',
		overlay: {
			errors: true,
		},
		hot: true
	},
	config.plugins.push(
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	)
}else {
	config.output.filename = '[name].[chunkhash:8].js',
	config.module.rules.push({
		test: /\.styl/,
		use: [
			{
				loader: MiniCssExtractPlugin.loader,
				options: {
					publicPath: './',
					hmr: process.env.NODE_ENV ==='development',
				},
			},
			'css-loader',
			{
				loader: 'postcss-loader',
				options: {
					sourceMap: true
				}
			},
			'stylus-loader'
		]
	})
	config.plugins.push(
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// all options are optional
			filename: 'styles.[chunkhash].[name].css',
			chunkFilename: '[id].css',
			ignoreOrder: false, // Enable to remove warnings about conflicting order
    	})
	)
}


module.exports = config;