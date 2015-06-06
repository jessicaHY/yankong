/**
 * Created by Yinxiong on 2014-04-24.
 */

var restrict = require('cloud/utils/auth').restrict;

exports.run = function(router){

    router.get('/', restrict, function(req, res){
        var user = AV.User.current();

        res.render('index',{
            title: "颜控管理后台"
        });
    });

    router.get('/test', function(req, res){
        res.render('test')
    })
}