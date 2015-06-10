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

module.exports = AV.Cloud;
