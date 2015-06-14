var AV = require('leanengine');

/**
 * 一个简单的云代码方法
 */
AV.Cloud.define('hello', function(request, response) {
  response.success('Hello world!');
});

AV.Cloud.define("savePost", function(req, res) {
    var token = req.object.get("token");
    var imgData = req.object.get("imgData");
    var videoData = req.object.get("videoData");
    AV.User.become(token, {
        success: function(user) {

        },
        error: function(error) {

        }

    })


})

AV.Cloud.define("_conversationAdd", function(req, res) {
    console.log(req.params)
    req.success()
});

AV.Cloud.define("_messageReceived", function(req, res) {//消息到达
    //redirectMsg(req.params);
    console.log(req.params);
    //    .then(function(result) {
    //    res.success(result);
    //}, function(error) {
    //    console.log(error.message)
    //    res.success();
    //})
    req.success()
})

function redirectMsg(params) {
    //var p = new AV.Promise();
    var toPeers = params.toPeers;
    var contentStr = params.content;
    console.log(contentStr)
}

function getPushMessage(params, user) {
    var contentStr = params.content;
    var json = {
        badge: "Increment",
        sound: "default"
        //,"_profile": "dev"
    };
    var msg = JSON.parse(contentStr);
    var msgDesc = getMsgDesc(msg);
    var name = user.get('username');
    json.alert = name + ' : ' + msgDesc;
    return JSON.stringify(json);
}

function _receiversOffLine(params) {
    var p = new AV.Promise();
    muser.findUserById(params.fromPeer).then(function (user) {
        var msg = getPushMessage(params, user);
        p.resolve({pushMessage: msg});
    }, mutil.rejectFn(p));
    return p;
}

function receiversOffline(req, res) {

    console.log(req.params);
    res.success();
    //if (req.params.convId) {
    //    // api v2
    //    _receiversOffLine(req.params).then(function (result) {
    //        res.success(result);
    //    }, function (error) {
    //        console.log(error.message);
    //        res.success();
    //    });
    //} else {
    //    console.log("receiversOffline , conversation id is null");
    //    res.success();
    //}
}

module.exports = AV.Cloud;
