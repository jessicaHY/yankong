/**
 * Created by lj on 15-6-14.
 */

var AV = require('leanengine');
var AclService = require('../service/AclService').service;

AV.Cloud.define("delUser", function(req, res) {
    var id = req.params.id
    var query = new AV.Query(AV.User);
    query.get(id).then(function(user) {
        user.save({
            status: -1
        }, {
            success: function(user) {
                res.success(user)
            },
            error: function(user, err) {
                console.log(err)
                res.error(err)
            }
        });
    }, function(user, err) {
        console.log(err)
        res.error(err)
    })
})

AV.Cloud.onLogin(function(request, response) {
    // 因为此时用户还没有登录，所以用户信息是保存在 request.object 对象中
    console.log("on login:", request.object);
    if (request.object.get('status') == -1) {
        // 如果是 error 回调，则用户无法登录（收到 401 响应）
        response.error('Forbidden');
    } else {
        // 如果是 success 回调，则用户可以登录
        response.success();
    }
});

AV.Cloud.afterSave("_User", function(req) {
    console.log("afterSave _User", req.object.id);

    req.object.setACL(AclService.selfStaffWrite(req.object.id));
    req.object.save().then(function() {
        console.log("acl set success");
    }, function() {
        console.error("acl set error");
        console.dir(arguments);
    })
})

module.exports = AV.Cloud;