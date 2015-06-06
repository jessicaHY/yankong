/**
 * Created by lj on 15-6-5.
 */


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