/**
 * Created by joan on 2015/6/11.
 */

var router = require('express').Router();
var AV = require('leanengine');
var restrict = require('../utils/auth').restrict;
var Recommend = AV.Object.extend("Recommend");
var AclService      = require('../service/AclService').service;
var OBJECTSTATUS    = require('../utils/const').OBJECTSTATUS;
var FileUtil = require('../utils/FileUtil').FileUtil;

router.get("/recommend/list", restrict, function(req, res) {
    var query = new AV.Query(Recommend);
    query.include();
    query.include(['user','image']);
    query.find({
        success: function(data) {
            res.render('manage-recommend', {
                postList: data.map(function( rec ){
                    console.log( rec.get('user').get('nickName'));
                    return rec;
                })
            })
        },
        error: function (data, err) {
            console.dir(arguments)
        }
    })
})

router.get("/recommend/:rid", restrict, function(req, res) {
    var query = new AV.Query(Recommend);
    query.get(req.params.rid).then(function(r) {
        res.send(r)
    }, function(error) {
        res.send(error)
    })
})

router.get("/ajax/recommend/del/:rid", restrict, function(req, res) {
    var query = new AV.Query(Recommend);
    query.get(req.params.rid).then(function(r) {
        r.set("status", OBJECTSTATUS.DELETED);
        r.save().then(function(r) {
            res.send(r)
        }, function(error) {
            res.send(error)
        })
    }, function(error) {
        res.send(error)
    })
})

router.get("/recommend1/add", restrict, function(req, res) {
    console.log("get...")
    res.render('manage-recommend-add', {
        title: "添加推荐"
    });
})


router.post("/recommend/add", restrict, function(req, res) {
    var imageFile = req.files.image;
    console.log(imageFile)
    if(imageFile) {
        FileUtil.readFile(imageFile.path, imageFile.name, function(imgFile, err) {
            if(err) {
                res.json(err)
            }
            var re = new Recommend();
            re.set("title", req.body.title);
            re.set("image", imgFile);
            re.set("user", AV.User.current());
            re.set("content", req.body.content);
            re.set("ACL", AclService.staffWrite());
            re.save().then(function(obj) {
                res.redirect('/manage/recommend/list' );
            }, function(error){
                console.log(err)
                res.send(error)
            })
        })
    } else {
        res.send("请选择一个图片文件")
    }
})

module.exports = router;