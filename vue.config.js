const path = require('path');

const resolve = dir => {
    return path.join(__dirname, dir);
};

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
// iview-admin线上演示打包路径： https://file.iviewui.com/admin-dist/
const BASE_URL = process.env.NODE_ENV === 'production'
    ? '/'
    : '/';

module.exports = {
    // Project deployment base
    // By default we assume your app will be deployed at the root of a domain,
    // e.g. https://www.my-app.com/
    // If your app is deployed at a sub-path, you will need to specify that
    // sub-path here. For example, if your app is deployed at
    // https://www.foobar.com/my-app/
    // then change this to '/my-app/'
    baseUrl: BASE_URL,
    // tweak internal webpack configuration.
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    // 如果你不需要使用eslint，把lintOnSave设为false即可
    lintOnSave: false,
    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
            .set('_c', resolve('src/components'));
    },
    // 打包时不生成.map文件
    productionSourceMap: false,

    // 通过反向代理来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
    devServer: {
        host: '0.0.0.0',
        port: 8088,
        proxy: {
            '/proxy/*': {
                // target: 'http://47.106.211.58:9998/', // 正式环境地址
                target: 'http://172.16.10.115:8090/', // 测试环境地址
                // target: 'http://10.0.20.20:8080/', // 杨健本地地址
                // target: 'http://10.0.16.241:9999/', // 本地ip
                // target: 'https://www.easy-mock.com/mock/5bce871a98c3e07240b7e07e/jimilbs',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy': ''
                }
            }
        }
    }
};
