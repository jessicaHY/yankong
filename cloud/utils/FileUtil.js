/**
 * Created by luojuan on 2015/6/7.
 */

var fs = require('fs');
var FileUtil = AV.Object.extend("FileUtil", {
    readFile: function(path, name, callback) {
        fs.readFile(path, function(err, data) {
            if (err)
                console.dir(err)
            var base64Data = data.toString('base64');
            var theFile = new AV.File(name, {base64: base64Data});
            theFile.save().then(function(file){
                callback(file);
            }, function(file, err) {
                callback(file, err)
            });
        })
    }
});


exports.FileUtil = new FileUtil();