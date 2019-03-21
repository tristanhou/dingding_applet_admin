var express = require('express'); 
var app = express(); 
var proxy = require('http-proxy-middleware'); 
var host = 'localhost'; var port = '3000'; 
app.use('/', express.static('static')); //设置静态资源
app.use('/api/*',proxy({
    target:'http://music.163.com/api', //代理域名或ip
    changeOrigin:true,
    pathRewrite:{
        '^/api':''
    }}));
app.listen(port, function () {console.log('server is listening at http://%s:%s',host,port);});

