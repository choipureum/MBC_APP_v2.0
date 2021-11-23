const path = require('path');
const VueLoaderPlugin = require("vue-loader/lib/plugin");

/**
 * @author imbc
 * @description single page application 
 * 
 * */
module.exports = {
    devtool: 'source-map', // 완전한 소스맵 : 완벽소스맵
    //devtool: "inline-source-map",
    //devtool: 'cheap-module-eval-source-map',// 빌드시 : 한줄소스맵
    //devtool: 'eval-source-map', // 불완전한 소스맵

    entry: {
        app: './main.js',
    },
    output: {
        publicPath: './dist/',
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle_[name].js'
    },
    mode: 'production',
    module: {
        rules: [
            { 
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'] 
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                      esModule: false
                    }
                  }
                ]
            },
            {
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: {
                    loader: 'babel-loader', 
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
    plugins: [new VueLoaderPlugin()],   
    watch: true //자동 번들화 작업 여부
};