module.exports = {
    outputDir: 'dist',   //build输出目录
    assetsDir: 'assets', //静态资源目录（js, css, img）
    lintOnSave: false, //是否开启eslint
    devServer: {
        open: true, //是否自动弹出浏览器页面
        host: "localhost", //本地服务器
        port: '8090', //本地接口
        https: false, //是否使用https协议
        hotOnly: true, //是否开启热更新
        proxy: {
            '/api': {
                target:'http://localhost:8080/api/v1', // 你请求的第三方接口
                changeOrigin:true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
                pathRewrite:{  // 路径重写，
                    '^/api': ''  // 替换target中的请求地址，也就是说以后你在请求http://localhost:8080这个地址的时候直接写成/api即可。
                }
            }
        },
    }
}