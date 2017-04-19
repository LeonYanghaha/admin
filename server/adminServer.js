/**
 * Created by Administrator on 2017/4/19.
 *
 *  admin server
 *
 */

var adminDao = require('../dao/adminDao.js');
module.exports = {
    /*
     * 20170419
     * get
     * 管理其他管理员
     * 只有超级管理员才能进入这个路由
     * */
    admin_super:function(data_admin_super,cb){
        adminDao.admin_super(data_admin_super,cb);
    },
    /*
    * 20170419
    * 照片管理
    * */
    admin_photo:function(dataP,cb){
        adminDao.admin_photo(dataP,cb);
    }

}