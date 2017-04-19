/**
 *2017/3/19.
 */
var sha1 = require('utility');
module.exports = {

    /*
    * 20170419
    * 检查cookie
    * */
    checkLogin: function checkLogin(req, res, next) {
       var sessionName = req.session.user.userName ;
       var  sessionNameMd5 =  sha1.md5(data.sessionName);
       var cookie = req.cookie ;
        console.log("sessionName:"+sessionName);
        console.log("sessionNameMd5:"+sessionNameMd5);
        console.log("cookie:"+cookie);
        if(cookie == sessionNameMd5){
            next();
        }else{
            next();
        }
    } ,
    /*
    * 检查是否登陆
    * */
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            return res.redirect('../../admin/login');
        }
        next();
    }
};
