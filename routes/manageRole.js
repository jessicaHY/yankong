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
            console.dir(arguments)
            if(!role) {
                res.render('staff', {
                    title: "工作人员",
                    staffList: []
                });
                return
            }
            role.getUsers().query().find().then(function( data ){

                res.render('staff', {
                    title: "工作人员",
                    staffList: data
                });
            })
        },
        error: function( role, err ){
            console.log('error')
        }
    });
});

router.post('/ajax/staff/add', restrict, function(req, res){
    var name = req.body.username;
    if( name ){
        RoleService.add('staff', 'username', name).then(function( user ){
            res.send( user );
        }, function( err ){
            res.send(err)
        });
    }else{
        res.send(false);
    }
});

router.post('/ajax/staff/del', restrict, function( req, res ){
    var id = req.body.id;

    if( id ){
        RoleService.remove('staff', id).then(function( user ){

            res.send(user);
        }, function(err){

            res.send(err);
        });
    }else{

        res.send(false);
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