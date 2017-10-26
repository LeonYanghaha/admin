/**
 * Created by Yangk on 2017-04-16.
 */
var express = require('express');
var router = express.Router();
var config = require('config-lite');
var querystring = require('querystring');
var sha1 = require('utility');
var superagent = require('superagent');
var user = require('../entity/user');
var http = require('http');
var user = require('../entity/user');
var checkLogin = require('../middlewares/check.js').checkLogin;
var adminServer = require('../server/adminServer');

var dataP = require("../entity/data");

/*
 * 20170419
 * get
 * 管理其他管理员
 * 只有超级管理员才能进入这个路由
 * */
router.get(
    '/admin_super/:page_current',
    checkLogin,
    function(req,res){
        var data_admin_super = new dataP();
        data_admin_super.page_current =  req.params.page_current;
        data_admin_super.page_colum = config.page_colum;//每页显示的记录数
        adminServer.admin_super(data_admin_super,function(data){

            if(0==(data-0)){
                //没有查到数据或者查询出错
                res.render('admin_super',{title:'照片管理',user:req.session.user,data:0});
            }else{
                //成功的返回了数据
                res.render('admin_super',{title:'照片管理',user:req.session.user,data:data});
            }
        });
    }
);
router.get(
    '/admin_super',
    checkLogin,
    function(req,res){
        res.redirect('../../admin/admin_super/1');
    }
);

/*
 * 20170419
 * get
 * 管理照片
 * */
router.get(
    '/admin_photo/:page_current',
    checkLogin,
    function(req,res){
        dataP.page_current =  req.params.page_current;
        adminServer.admin_photo(dataP,function(data){
            if(0==(data-0)){
                //没有查到数据或者查询出错
                res.render('admin_photo',{title:'照片管理',user:req.session.user,data:0});
            }else{
                //成功的返回了数据
                res.render('admin_photo',{title:'照片管理',user:req.session.user,data:data});
            }
        });
    }
);
/*
 * 20170419
 * get
 * 管理照片
 * */
router.get(
    '/admin_photo',
    checkLogin,
    function(req,res){
        res.redirect('../../admin/admin_photo/1');
    }
);

/*
 * 20170419
 * get
 * 管理其他用户
 * */
router.get(
    '/admin_user',
    checkLogin,
    function(req,res){

        res.render('admin_user',{title:'用户管理',user:req.session.user});
    }
);

/*
 * 20170419
 * get
 * 当前管理员退出登录
 * */
router.get(
    '/logout',
    function(req,res){
        delete req.session.user;
        res.redirect('../');
    }
);


/*
 * 20170430
 * get
 * 测试的路由
 * */
router.get(
    '/test',
    function(req,res){
        var cookuserMd5 = req.cookies.userMd5;
        try{
            if(cookuserMd5.length!=32){
                cookuserMd5 = '0';
            }
        }catch (e) {
            cookuserMd5 = '0';
        };
        console.log(cookuserMd5);
        res.render('result',{title:'fail',user:req.session.user});
    }
);


/*
 * 20170416
 * post
 * 接受用户的登录请求
 * */
router.post(
    '/login',
    function(req,res){
        req.on('data',function(data){
            var data = querystring.parse(data.toString());
            var username = data.userName;
            var password = sha1.md5(data.userPassword);
            var user ;
            var cookuserMd5 = req.cookies.userMd5;
            try{
                if(cookuserMd5.length!=32){
                    cookuserMd5 = '0';
                }
            }catch (e) {
                cookuserMd5 = '0';
            };
            var promise = new Promise(function(resolve, reject){
                superagent.get(config.sso_url+"?username="+username+"&password="+password+'&cookies='+cookuserMd5)
                    .end(function(err,result){
                        if(err){//登陆出错
                            reject(0);
                        }else{
                            var result = JSON.parse(result.text);
                            var logint_state  = result.logint_state-0;
                            if(1==logint_state){
                                user = JSON.parse(result.user);
                                req.session.user = user;
                                /*
                                * 成功登录以后，
                                * 需要往cookie里写入登录信息。
                                * */
                                res.cookie ('userMd5',sha1.md5(user.userName));
                                resolve(1);
                            }else{//登陆失败
                                resolve(0);
                            }
                        }
                    });
            });
            promise.then(function(value) {
                if(1==value){
                    res.render('result',{title:'登录成功',user:req.session.user,userMd5:sha1.md5(req.session.user.userName)});
                }else{
                    res.render('result',{title:'fail',user:req.session.user});
                }
            }, function(value) {
                console.log("error");
                res.render('result',{title:'fail',user:req.session.user});
            });
            /*
            * 20170419
            * 其实下面的这个写法也是可以的。
            * 可以实现同步的返回数据。
            *
            *
            * 但是现在用到了promise。
            * */
            //rp(config.sso_url+"?username="+username+"&password="+password)
            //    .then(function (data) {
            //        console.log(data);
            //        console.log("123456");
            //        res.render('result',{title:'登陆成功。。。。。。。。'});
            //    })
            //    .catch(function (err) {
            //        console.log("789");
            //    });
            /*
            * 20170418
            * superagent在这里没法使用。
            * 由于它是异步的。
            * 所以在这里有很多的问题。
            * 重新想办法吧。
            * */
            //superagent.get(config.sso_url+"?username="+username+"&password="+password)
            //    .end(function(err,result){
            //        console.log(result.text);
            //        if(err){//登陆出错
            //            console.log("哎吆。。出错了。。。。。。");
            //            res.render('result',{title:'--------。登陆失败',user:req.session.user,page_flag:1,path:config.path});
            //        }else{
            //            var result = JSON.parse(result.text);
            //            var logint_state  = result.logint_state-0;
            //            if(0==logint_state){//登陆失败
            //                res.render('result',{title:'--------。登陆失败',user:req.session.user,page_flag:1,path:config.path});
            //            }else{
            //                //user.userName = result.userName;
            //                //user.userAddress = result.userAddress;
            //                //user.userEmail = result.userEmail;
            //                //user.userHead = result.userHead;
            //                //user.userId = result.userId;
            //                //user.userIntroduce = result.userIntroduce;
            //                //user.userSex = result.userSex;
            //                //user.userState = result.userState;
            //                //user.userType = result.userType;
            //                //user.userBack =  result.userBack;
            //                //req.session.user = user;
            //                //console.log(user);
            //                res.render('result',{title:'登陆成功。。。。。。。。'});
            //            }
            //        }
            //    });
        });
    });

/*
 * 20170416
 * get请求
 * 调转到登陆的页面
 * */
router.get(
    '/login',
    function(req,res){
        res.render('admin_login',{title:"登陆",path:config.path});
    });

module.exports = router;
