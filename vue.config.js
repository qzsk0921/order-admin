const path = require('path')
const defaultSetting = require('./src/setting.js')

function resolve(dir) {
    return path.join(__dirname, dir)
}

const name = defaultSetting.title || 'order background management system' // page title

// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// 合拍服务配置
// location ^~ /meet/ {
//     alias /data0/wwwroot/HEPAI-H5/meet-website-online/;
// }

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 8080 // dev port

module.exports = {
    publicPath: './',
    // assetsDir: 'meet',
    outputDir: process.env.NODE_ENV == 'development' ? 'devdist' : 'dist',
    devServer: {
        port: port,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        // before: require('./mock/mock-server.js')
    },
    // css相关配置
    css: { //向所有 Sass 样式传入共享的全局变量 一次配置全局使用，这个scss每个文件都需要
        loaderOptions: {
            sass: {
                prependData: `@import "~@/style/common";`,
            }
        },
        // 是否使用css分离插件 ExtratTextPlugin
        extract: true,
        // 开启 css source maps
        sourceMap: false,
        //启用 css modules for all css / pre-processor files
        modules: false,
    },
    lintOnSave: false, //关闭eslint
    productionSourceMap: false, // 如果不需要生产的源映射，将其设置为false可以加速生产构建。
    // devServer: { //配置服务器
    //     port:8086,
    //     open:true,
    //     https:false,
    //     overlay: {
    //         warnings: true,
    //         errors: true
    //     },
    //     proxy: {
    //         '/hepai': {
    //             target: 'https://m6.quhepai.com/',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 "^/hepai" : "/"
    //             }
    //         }
    //     }
    // },
    // devServer: {
    //     proxy: {
    //         '/api/': {
    //             target: 'https://m6.quhepai.com',
    //             changeOrigin: true,
    //             secure: false,  // 如果是https接口，需要配置这个参数
    //             ws: true,
    //             // pathRewrite: {
    //             //   '^/api/': ''
    //             // }
    //         }
    //     }
    // },
    // devServer: {
    //     proxy: {
    //         '/': {
    //             ws: false,
    //             target: 'https://m6.quhepai.com/',
    //             changeOrigin: true,
    //             pathRewrite: {
    //                 "^/": "/"
    //             }
    //         }
    //     }
    // },
    configureWebpack: { //覆盖webpack默认配置
        // provide the app's title in webpack's name field, so that
        // it can be accessed in index.html to inject the correct title.
        name: name,
        resolve: { // 配置解析别名
            alias: {
                '@': path.resolve(__dirname, './src'),
                // '@h':path.resolve(__dirname, './src/assets/hotcss'),
                // '@s':path.resolve(__dirname, './src/assets/style'),
                // '@i':path.resolve(__dirname, './src/assets/images'),
            }
        },
        plugins: [
            // new PrerenderSPAPlugin({
            //     // Required - The path to the webpack-outputted app to prerender.
            //     staticDir: path.join(__dirname, 'dist'),
            //     // Required - Routes to render.
            //     // routes: [ '/', '/product', '/contact' ],
            //     routes: ['/', '/registration', '/success', '/instruction'],
            // })
        ]
    },
    chainWebpack: (config) => {
        // 设置svg-sprite-loader 方式1
        // const svgRule = config.module.rule('svg')
        // svgRule.uses.clear()
        // svgRule
        //     .use('svg-sprite-loader')
        //     .loader('svg-sprite-loader')
        //     .options({
        //         symbolId: 'icon-[name]'
        //     })

        // set svg-sprite-loader 方式2
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icon'))
            .end()
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icon'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end()
    },
}