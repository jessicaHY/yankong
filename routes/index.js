/**
 * Created by luojuan on 2015/6/6.
 */
var router = require('express').Router();
var AV = require('leanengine');
var FileUtil = require('../utils/FileUtil').FileUtil;
var Post = AV.Object.extend("Post");
var UserExtend = AV.Object.extend("UserExtend");
var restrict = require('../utils/auth').restrict;
var result          = require('../utils/resultJson').result;

router.get('/', restrict, function(req, res){
    var user = req.AV.user;

    res.render('index', {
        title: "颜控管理后台"
    });
});

router.post('/upload/post', function(req, res) {
    var token = req.body.token;
    //console.log("token====" + token)
    var content = req.body.content;
    var seconds = req.body.seconds;
    content = filterCrabedContent(content);

    var param = {
        content: content,
        seconds: seconds
    };
    var imageFile = req.files.imageFile;
    //console.log(imageFile)
    var videoFile = req.files.videoFile;
    //console.log(videoFile)

    AV.User.become(token, {
        success: function(user) {
            //console.log(user)
            param.user = user
            FileUtil.readFile(imageFile.path, imageFile.name, function(imgFile, err) {
                if(err) {
                    res.json(err)
                }
                param.imgFile = imgFile
                if(videoFile) {
                    FileUtil.readFile(videoFile.path, videoFile.name, function(audio, err) {
                        if(err) {
                            res.json(err)
                        }
                        param.audio = audio
                        addPost(param, function(obj) {
                            console.log("callback")
                            res.json(obj)
                        })
                    })
                } else {
                    addPost(param, function(obj) {
                        console.log("callback")
                        res.json(obj)
                    })
                }
            })
        },
        error: function(error) {
            console.log("callback")
            res.json(error)
        }
    })
})

function addPost(param, callback) {
    var post = new Post();
    post.set("user", param.user);
    post.set("image", param.imgFile);
    if(param.audio) {
        post.set("audio", param.audio);
        post.set("seconds", param.seconds);
    }
    post.set("content", param.content);
    post.save({
        favoriteCount: 0, replyCount: 0
    }, {
        success: function(obj) {
            console.log(obj)
            var status = new AV.Status('��ͼ', param.content);
            status.set('host', obj);
            status.inboxType = 'post';
            AV.Status.sendStatusToFollowers(status).then(function(status) {
                incrPostCount(param.user);
                callback(obj)
            }, function(status, err){
                callback(obj, err)
            });
        }, error: function(obj, err) {
            callback(obj, err)
        }
    })
}

function incrPostCount(user) {
    var query = new AV.Query(UserExtend);
    query.get(user.get('uextend').id, {
        success: function(obj) {
            obj.increment("postCount", 1);
            obj.save();
        }, error: function(obj, err) {
            console.dir(arguments)
        }
    })
}

router.post("/settings", function(req, res) {
    var token = req.body.token;
    var nickName = req.body.nickName;
    nickName = filterCrabedContent(nickName);
    var sex = req.body.sex;
    var tagsArray = req.body.tagsArray;
    var tags = [];

    var introduce = req.body.introduce;
    introduce = filterCrabedContent(introduce);

    AV.User.become(token).then(function(user) {
        user.set("sex", sex);
        user.set('nickName', nickName);
        user.set('introduce', introduce);
        if(sex == 1) {
            for(var i = 0; i<tagsArray.length; i++) {
                var t = filterCrabedContent(tagsArray[i]);
                if(t == '' || t.trim() == '') {
                    continue;
                }
                tags.push(t);
            }
            user.set('tags', tags);
        }
        user.save().then(function(obj) {
            res.json(obj);
        }, function(error) {
            res.json(error)
        })
    }, function(error) {
        res.json(error)
    })
})

function checkNickName(nickname) {
    if(!nickname || nickname.length < 2 || nickname.length > 14) {
        console.log("nickname length error")
        return false;
    }
    if(!nickname.match(/^(?![0-9]+$)[\w\u4e00-\u9fa5]+/)) {//不能全部是数字
        console.log("nickname geshi error")
        return false;
    }
    if(isCrabedContent(nickname)) {
        console.log("nickname crab error")
        return false;
    }
    return true;
}

function filterCrabedContent(content) {
    var crabList = CrabTreeHandler.getCrabList(content);
    console.error(crabList);
    crabList.forEach(function(crab) {
        content = content.split(crab).join('')
    })
    return content;
}

module.exports = router;