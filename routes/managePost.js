/**
 * Created by joan on 2015/6/11.
 */

var router = require('express').Router();
var AV = require('leanengine');
var restrict = require('../utils/auth').restrict;
var Post = AV.Object.extend("Post")

router.get("/post/list", restrict, function(req, res) {

    var query = new AV.Query(Post);
    query.include("user");
    query.include("image");
    query.find({
        success: function(data) {
            for(var i = 0; i<data.length; i++) {
                console.log(data[i].get("image").url());
            }
            res.render('manage-post', {
                postList: data
            })
        },
        error: function (data, err) {
            console.dir(argument)
        }
    })
})

module.exports = router;