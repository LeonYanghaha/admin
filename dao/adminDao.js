/**
 * Created by Administrator on 2017/4/19.
 */

var query = require('./getPool.js');
var data = require("../entity/data");
var config = require('config-lite');

module.exports = {
    /*
     * 20170419
     * get
     * 管理其他管理员
     * 只有超级管理员才能进入这个路由
     * */
    admin_super:function(data_admin_super,cb){
        query('SELECT COUNT(0) count FROM USER WHERE userType >=11 AND userType <=20',
                 function(err,data){
                    if(err){
                        console.log("admin_super_1 出错");
                        cb(0);
                    }else{
                        var page_count_data = data[0].count;
                        query(
                            'SELECT user.userId,user.userName,user.userPassword,user.userEmail,user.userSex,user.userAddress,user.userIntroduce,user.userState,user.userHead,user.userType,user.userBack FROM USER WHERE userType >=11 AND userType <=20 ORDER BY userid LIMIT ?,?',
                            [(data_admin_super.page_current-0-1)*(data_admin_super.page_colum-0),data_admin_super.page_colum-0],
                            function(err,result){
                                if(err){
                                    console.log("admin_super_2 出错");
                                    cb(0);
                                }else{
                                    var datalength = data.length-0;
                                    if(datalength>=0){
                                        data_admin_super.page_count_page =Math.ceil(page_count_data/( config.page_colum-0)) ;  //总页数
                                        data_admin_super.page_count_data = page_count_data ;  //总记录数
                                        data_admin_super.page_current = data_admin_super.page_current-0;//当前页数
                                        data_admin_super.page_data = result;  //每页显示的数据
                                        data_admin_super.page_colum = config.page_colum-0;//每页显示的记录数
                                        cb(data_admin_super);
                                    }else{
                                        cb(0);
                                    }
                                }
                            }
                        );
                    }
                 });
    },
    /*
     * 20170419
     * 照片管理
     * */
    admin_photo:function(dataP,cb){
        query(
            'SELECT COUNT(0) count FROM photo',
            function(err,datas){
                if(err){
                    console.log("admin_photo_1_ ERROR!");
                    cb(0);
                }else{
                    var lengthP = datas[0].count-0 ;
                    if(lengthP>=1){
                        query(
                            'SELECT photo.photoId,photo.photoName,photo.photoUser,photo.photoAddress,photo.photoCreatetime,photo.photoUpdatetime,photo.photoIntroduce,photo.phototState,photo.photoNiname,user.userId,user.userName,user.userPassword,user.userEmail,user.userSex,user.userAddress,user.userIntroduce,user.userState,user.userHead,user.userType,user.userBack FROM photo LEFT JOIN USER ON photo.photoUser= user.userId ORDER BY photo.photoUpdatetime DESC LIMIT ?,? ;',
                            [(dataP.page_current-0-1)*(dataP.page_colum-0),dataP.page_colum-0],
                            function(err,result){
                                if(err){
                                    console.log("admin_photo  出错");
                                    cb(0);
                                }else{
                                    var lengthD = result.length-0;
                                    if(lengthD>=1){
                                        var dataPage = new data();
                                        dataPage.page_count_page =Math.ceil(lengthP/( config.page_colum-0)) ;  //总页数
                                        dataPage.page_count_data = lengthP ;  //总记录数
                                        dataPage.page_current = dataP.page_current-0;//当前页数
                                        dataPage.page_data = result;  //每页显示的数据
                                        dataPage.page_colum = config.page_colum-0;//每页显示的记录数
                                        cb(dataPage);
                                    }else{//没有查到数据
                                        cb(0);
                                    }
                                }
                            }
                        );
                    }else{
                        cb(0);
                    }
                }
            }
        );
    }
}



