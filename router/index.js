/*
* 20170416
* 整个项目的入口路由
* */

var checkLogin = require('../middlewares/check.js').checkLogin;
var config = require('config-lite');


module.exports = function(app){

    /*
     * 20170416
     * 处理以admin 开头的路由。
     * */
    app.use('/admin', require('./admin.js'));

    /*
    * 20170416
    * 跳转到主页
    * 经过中间件的校验，如果当前没有用户登陆，则直接挑到登陆页面。
    * */
    app.get('/',
        checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
        function(req,res){
            res.render('admin_index');
        });
};



