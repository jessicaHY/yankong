/**
 * Created by Yinxiong on 2014-04-24.
 */

var RoleService = require('cloud/service/RoleService').service;
var restrict = require('cloud/utils/auth').restrict;

exports.run = function(router){

    /***********************************************
     * 工作人员
     */

    router.get('/role/staff', restrict, function(req, res){

        new AV.Query(AV.Role).equalTo('name','staff').first({
            success: function( role ){
                role.getUsers().query().find().then(function( data ){

                    res.render('role/staff', {
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
};