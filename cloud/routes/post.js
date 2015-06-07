/**
 * Created by luojuan on 2015/6/6.
 */
var FileUtil = require('cloud/utils/FileUtil').FileUtil;
var Post = AV.Object.extend("Post");
var UserExtend = AV.Object.extend("UserExtend");

exports.run = function(router) {
    router.post('/upload/post', function(req, res) {
        var token = req.body.token;
        //console.log("token====" + token)
        var content = req.body.content;
        var seconds = req.body.seconds;
        var param = {
            content: content,
            seconds: seconds,
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
                var status = new AV.Status('·¢Í¼', param.content);
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
}