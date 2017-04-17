/*
 * 20170416
 * 整个程序的入口
 * */
var express = require('express');
var ejs = require('ejs');
var config = require('config-lite');
var route = require('./router/index.js');
var path = require('path');
var flash = require('connect-flash');
var session = require('express-session');

var app = express();

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

// 设置静态文件目录
app.use(express.static('style'));

// session 中间件
app.use(session({
    name: config.session.key,
    secret: config.session.secret,
    cookie: {
        maxAge: config.session.maxAge
    }
}));

//设置模版引擎
app.set('view engine','ejs');

app.set('views',__dirname+"/views");


//使用flash中间件
app.use(flash());

route(app);

app.listen(
    config.host_port,
    config.host_url
);


