/**
 * Created by luojuan on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');
var restrict = require('../utils/auth').restrict;
var $ = require('jquery')

router.get("/user/list", restrict, function(req, res) {

    var nickName = req.query.nickName;
    var query = new AV.Query(AV.User);
    if(nickName) {
        query.equalTo("nickName", nickName);
    }
    query.find({
        success: function(data) {
            var result = []
            for(var i = 0; i<data.length; i++) {
                var d = data[i];
                d['showGender'] = d.get("sex") == 1 ? "男" : "女";
                d['showStatus'] = d.get("status") == 0 ? "正常" : "已封禁";
                d['normal'] = d.get("status") == 0;
                result.push(d)
            }
            res.render('manage-user', {
                userList: result,
                nickName: nickName
            })
        },
        error: function (data, err) {
            console.dir(argument)
        }
    })
})

router.get('/ajax/user/del/:id', restrict, function( req, res ){
    var id = req.params.id;
    console.log(id);
    if( id ){
        AV.Cloud.run('delUser', {id: id}, {
            success: function(result) {
                console.dir(result)
                res.send(result)
            },
            error: function(error) {
                console.dir(arguments)
                res.send(error);
            }
        });
    }else{
        res.send(false);
    }
});

module.exports = router;