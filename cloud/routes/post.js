/**
 * Created by luojuan on 2015/6/6.
 */

exports.run = function(router) {
    router.post('/upload/post', function(req, res) {
        var token = req.body.token;
        console.log("token====" + token)
        var imageFile = req.files.imageFile;
        console.dir(imageFile)
        fs.readFile(imageFile.path, function(err, data){
            if(err)
                console.dir(err)
            var base64Data = data.toString('base64');
            console.log(base64Data)
            var theFile = new AV.File(imageFile.name, {base64: base64Data});
            theFile.save().then(function(theFile){
                console.dir(theFile)
                res.send('上传成功！');
            });
        });
        var videoFile = req.files.videoFile;
        console.dir(videoFile)
        AV.User.become(token, {
            success: function(user) {
                console.dir(user)
            },
            error: function(error) {
                console.dir(error)
            }
        })
    })
}