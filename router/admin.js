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
var rp = require('request-promise');
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

            rp(config.sso_url+"?username="+username+"&password="+password)
                .then(function (data) {
                    console.log(data);
                    console.log("123456");
                    res.render('result',{title:'登陆成功。。。。。。。。'});
                })
                .catch(function (err) {
                    console.log("789");
                    //res.render('result',{title:'登陆成功。。。。。。。。'});
                });
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