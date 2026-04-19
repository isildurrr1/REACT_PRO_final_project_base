const HTMLWebpackPlugins = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const production = process.env.NODE_ENV === 'production';

module.exports = {
	entry: path.resolve(__dirname, '..', './src/index.tsx'), //точка входа в наше приложение содержит абсолютный путь к index.ts
	output: {
		path: path.resolve(__dirname, '..', './dist'), //путь куда будет собираться наш проект
		filename: production
			? 'static/scripts/[name].[contenthash].js'
			: 'static/scripts/[name].js', // имя нашего бандла
		publicPath: '/',
	},
	//Нужно помочь вебпаку научится работать с jsx и tsx файлами для этого используют ts loader
	module: {
		rules: [
			{
				test: /\.[tj]sx?$/, //содержит регулярное выражение, которое содержит информацию какие файлы должны обрабатываться этим loader'ом
				use: [
					{
						loader: 'ts-loader',
					},
				], // для того чтобы ts-loader корректно отработал нам нужен tsconfig его можно создать вручную, а можно создать автоматически
				/** чтобы проиницилизовать его автоматически можно установить пакет typesctipt глобально или использовать npx выполнив команду npx tsc --init
				После создания конфига нужно включить "allowJs": true, чтобы работать не только c typescript, также меняем "jsx": "react" чтобы мы могли работать с react компонентами и включаем карту ресурсов "sourceMap": true, пока на этом все вернемся в этот конфиг позже*/
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg|gif|webp)$/,
				type: 'asset/resource',
				generator: {
					filename: 'static/images/[hash][ext][query]',
				},
			},
			{
				test: /\.(woff(2)?|eot|ttf|otf)$/,
				type: 'asset/resource',
				generator: {
					filename: 'static/fonts/[hash][ext][query]',
				},
			},
			{
				test: /\.svg$/i,
				issuer: /\.[jt]sx?$/,
				use: ['@svgr/webpack', 'url-loader'],
			},
			{
				test: /\.css$/,
				use: [
					production ? MiniCssExtractPlugin.loader : 'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: {
								mode: 'local',
								localIdentName: '[name]__[local]__[hash:base64:5]',
								auto: /\.module\.\w+$/i,
							},
							importLoaders: 1, //Значение 1 говорит о том, что некоторые трансформации PostCSS нужно применить до css-loader.
						},
					},
					'postcss-loader',
				],
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.tsx', '.ts', '.json'],
		plugins: [new TsconfigPathsPlugin({ configFile: path.resolve(__dirname, '..', 'tsconfig.json') })],
	},
	plugins: [
		new HTMLWebpackPlugins({
			template: path.resolve(__dirname, '..', './public/index.html'),
		}),
		new CleanWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: production
				? 'static/styles/[name].[contenthash].css'
				: 'static/styles/[name].css',
		}),
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'development', // значение по умолчанию 'development' если переменная process.env.NODE_ENV не передана
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify(process.env),
		}),
	],
};
