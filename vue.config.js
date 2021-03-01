module.exports = {
    publicPath: "",
    outputDir: "dist",
    assetsDir: "public",
    lintOnSave: false,
    runtimeCompiler: false,
    transpileDependencies: [
        /* string or regex */
    ],

    // generate sourceMap for production build?
    productionSourceMap: false,

    // tweak internal webpack configuration.
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    chainWebpack: () => {},
    //webpack.config
    configureWebpack: config => {
        config.entry = ["babel-polyfill", "./src/main.js"];
        if (process.env.NODE_ENV === "development") {
            config.devtool = "source-map";
            console.log('这是开发')
                // mutate config for production...
        } else if (process.env.NODE_ENV === "production") {
            // top = 1
            console.log('top生产')
        }
    },

    // CSS related options
    css: {
        extract: true,

        // enable CSS source maps?
        sourceMap: false,

        // pass custom options to pre-processor loaders. e.g. to pass options to
        // sass-loader, use { sass: { ... } }
        loaderOptions: {},

        // Enable CSS modules for all css / pre-processor files.
        // This option does not affect *.vue files.
        //启用css module 功能
        /*module: {
            rules: [
            {
              test: '\.vue$',
              loader: 'vue-loader',
              options: {
                cssModules: {
                  localIdentName: '[path][name]---[local]---[hash:base64:5]',
                  camelCase: true
                }
              }
            }
            ]
            }*/
        modules: false
    },

    // use thread-loader for babel & TS in production build
    // enabled by default if the machine has more than 1 cores
    parallel: require("os").cpus().length > 1, //超过一个内核就开启并行

    // options for the PWA plugin.
    // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
    pwa: {},

    // configure webpack-dev-server behavior
    devServer: {
        open: process.platform === "darwin",
        disableHostCheck: false,
        //      host: '127.0.0.1',
        port: 9527,
        https: false,
        hotOnly: false,
        // // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
        // string | Object
        proxy: {
            "^/_op:": {
                //测试  109
                target: "http://180.100.209.27:8000/operation/data/admin/",
                // target: 'http://127.0.0.1:8080/operation/data/admin/',
                changeOrigin: true,
                pathRewrite: {
                    "_op:": ""
                }
            },
            "^/_ed:": {
                target: "http://180.100.209.27:8000/edu/admin/",
                // target: 'http://192.168.1.106:8090/edu/admin/',
                changeOrigin: true,
                pathRewrite: {
                    "_ed:": ""
                }
            },
            "^/_auth:": {
                target: "http://180.100.209.27:8000/api/platform/",
                // target: 'http://192.168.5.197:8089/authorize/login',
                changeOrigin: true,
                pathRewrite: {
                    "_auth:": ""
                }
            },
            "^/_auths:": {
                // target: 'http://192.168.5.197:8060/api/platform',
                target: "http://180.100.209.27:8000/api/platform",
                changeOrigin: true,
                pathRewrite: {
                    "_auths:": ""
                }
            },
            "^/_sy:": {
                target: "http://180.100.209.27:8000/sync/tool/",
                changeOrigin: true,
                pathRewrite: {
                    "_sy:": ""
                }
            },
            "/api/": {
                target: "http://180.100.209.27:8000/",
                changeOrigin: true
            },
            "^/_sc:": {
                //线上
                target: "http://180.100.209.27:8000/score/management/",
                // target: "http://192.168.1.114:8070/score/management/",
                changeOrigin: true,
                pathRewrite: {
                    "_sc:": ""
                }
            },
            "^/_as": {
                // 自动排课

                // target: 'http://192.168.0.109:8050/auto/schedule/',
                target: "http://180.100.209.27:8000/auto/schedule/",
                changeOrigin: true,
                pathRewrite: {
                    "_as:": ""
                }
            }
        }
    },

    // options for 3rd party plugins
    pluginOptions: {
        // ...
    }
};