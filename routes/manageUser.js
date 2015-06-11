/**
 * Created by luojuan on 2015/6/7.
 */
var router = require('express').Router();
var AV = require('leanengine');
var restrict = require('../utils/auth').restrict;

router.get("/user/list", restrict, function(req, res) {

    new AV.Query(AV.User).find({
        success: function(data) {
            res.render('manage-user', {
                userList: data
            })
        },
        error: function (data, err) {
            console.dir(argument)
        }
    })
})

module.exports = router;