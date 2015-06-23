/**
 * Created by Yinxiong on 2014-04-24.
 */
var router = require('express').Router();
var AV = require('leanengine');
var RoleService = require('../service/RoleService').service;
var restrict = require('../utils/auth').restrict;

/***********************************************
 * 工作人员
 */
router.get('/staff/list', restrict, function(req, res){
    new AV.Query(AV.Role).equalTo('name','staff').first({
        success: function( role ){
            if(!role) {//没权限获取工作人员列表
                res.render('manage-staff', {
                    title: "工作人员",
                    staffList: []
                });
                return
            }
            role.getUsers().query().find().then(function( data ){
                //console.dir(data)
                var result = []
                for(var i = 0; i<data.length; i++) {
                    var d = data[i];
                    d['showGender'] = d.get("sex") == 1 ? "男" : "女";
                    d['showStatus'] = d.get("status") == 0 ? "正常" : "已封禁";
                    d['normal'] = d.get("status") == 0;
                    result.push(d)
                }
                res.render('manage-staff', {
                    title: "工作人员",
                    staffList: result
                });
            })
        },
        error: function( role, err ){
            console.log('error')
        }
    });
});

router.post('/staff/add', restrict, function(req, res){
    var name = req.body.mobile;
    if( name ){
        RoleService.add('staff', 'username', name).then(function( user ){
            res.redirect('/manage/staff/list' );
        }, function( err ){
            res.redirect('/manage/staff/list' );
        });
    }else{
        res.redirect('/manage/staff/list' );
    }
});

router.get('/staff/del/:id', restrict, function( req, res ){
    var id = req.params.id;

    if( id ){
        RoleService.remove('staff', id).then(function( user ){

            res.redirect('/manage/staff/list' );
        }, function(err){

            res.redirect('/manage/staff/list' );
        });
    }else{

        res.redirect('/manage/staff/list' );
    }
});

router.get('/role/search', restrict, function(req, res) {
    var query = new AV.Query(AV.Role);
    query.equalTo("name", "admin");
    query.first({
        success: function (obj) {
            console.dir(arguments);
            if (obj) {
                obj.relation("users").query().find({
                    success: function (results) {
                        console.log(results.length);
                        res.send(results);
                    },
                    error: function (error) {
                        res.send(error);
                    }
                });
            } else {
                res.send("null");
            }
        },
        error: function (error) {
            console.error(error);
            res.send("false");
        }
    });
});

module.exports = router;