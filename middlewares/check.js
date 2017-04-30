/**
 *2017/3/19.
 */
var sha1 = require('utility');
var express = require('express');

module.exports = {
    /*
    * 检查是否登陆
    * */
    checkLogin: function checkLogin(req, res, next) {
        console.log(req.session);
        if (!req.session.user) {
            console.log("456---------");
            return res.redirect('../../admin/login');
        }
        next();

    }
};
