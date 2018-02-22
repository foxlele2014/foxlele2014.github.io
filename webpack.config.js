/*
* @Author: limin
* @Date:   2018-01-02 14:59:25
* @Last Modified by:   limin
* @Last Modified time: 2018-01-02 16:25:17
*/
const path  = require('path');

//test
//多页面的，怎么获取到每个页面的入口js呢？
const webpackConfig = {
    entry:{
        index: path.resolve(__dirname,'index.js')
    },
    output:{
        filename:'[name].js',
        path: path.resolve(__dirname,'public')
    },
    module:{
        rules:[
            {
                test:/\.(js|jsx)$/,
                exclude: /(node_modules)/,
                use:[
                    {
                        loader:'babel-loader',
                        options:{
                            presets: ['env','react']
                        }
                    }
                ]
            },
            {
                test:/\.less$/,
                use:[
                    {
                        loader:'style-loader'
                    },
                    {
                        loader:'css-loader',
                    },
                    {
                        loader:'less-loader'
                    }
                ]
            },
            {
                test:/\.(png|jpeg|jpg|gif)$/,
                use:[
                    {
                        loader:'file-loader'
                    }
                ]
            }
        ]
    }
}

module.exports = webpackConfig;
