/**
 * Created by luojuan on 2015/6/7.
 */

var restrict = require('cloud/utils/auth').restrict;
exports.run = function(router) {
    router.get("/manager/user/list", restrict, function(req, res) {

        new AV.Query(AV.User).find({
            success: function(data) {
                res.render('manage-user', {
                    userList: JSON.stringify(data)
                })
            },
            error: function (data, err) {
                console.dir(argument)
            }
        })
    })
}