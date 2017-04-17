/**
 *2017/3/19.
 */
module.exports = {
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
