/**
 * Created by joan on 2015/6/11.
 */

var router = require('express').Router();
var AV = require('leanengine');
var restrict = require('../utils/auth').restrict;
var Recommend = AV.Object.extend("Recommend")

router.get("/recommend/list", restrict, function(req, res) {

    var query = new AV.Query(Recommend);
    query.include("user");
    query.include("image");
    query.find({
        success: function(data) {
            for(var i = 0; i<data.length; i++) {
                console.log(data[i].get("image").url());
            }
            res.render('manage-recommend', {
                postList: data
            })
        },
        error: function (data, err) {
            console.dir(argument)
        }
    })
})
router.get("/recommend/add", restrict, function(req, res) {
    res.render('manage-recommend-add', {
        title: "添加推荐"
    });
})

router.post("/recommend/add", restrict, function(req, res) {
    var file = req.files.image;
    if(file) {
        var name = "recommend.jpg";
        var avFile = new AV.File(name, file);
        var re = new Recommend();
        re.set("title", req.body.title);
        re.set("image", avFile);
        re.set("user", AV.User.current());
        re.set("content", req.body.content);
        re.save().then(function(obj) {
            res.redirect('/manage/recommend/list' );
        }, function(error){
            console.log(err)
            res.send(error)
        })
    } else {
        res.send("请选择一个图片文件")
    }
})

module.exports = router;