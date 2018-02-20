const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');

const DIST = path.resolve(__dirname, 'dist');
const SRC = path.resolve(__dirname, 'src');
const SCSS = path.resolve(__dirname, 'scss');

const scssRules = {
    test: /\.(scss|sass)$/,
    include: SCSS,
    loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    url: false,
                    plugins: () => [
                        require('autoprefixer')({
                            browsers: 'last 3 versions',
                            remove: false
                        })
                    ]
                }
            },
            'sass-loader'
        ]
    })
};

const jsRules = {
    test: /\.(js)$/,
    include: SRC,
    use: [
        {
            loader: 'babel-loader',
            options: {
                presets: [
                    [
                        'env',
                        {
                            targets: {
                                node: 'current'
                            }
                        }
                    ]
                ]
            }
        }
    ]
};

process.noDeprecation = true;

module.exports = {
    entry: {
        bundle: ['babel-polyfill', SRC]
    },
    output: {
        filename: '[name].js',
        path: DIST
    },
    module: {
        rules: [
            scssRules,
            jsRules,
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'raw-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(glsl|frag|vert)$/,
                loader: 'glslify-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [new ExtractTextPlugin('./style.css')]
};
