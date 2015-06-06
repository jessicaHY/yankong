/**
 * Created by Yinxiong on 2014-04-24.
 */


exports.run = function(router){

    router.get('/auth', function(req, res){
        res.render('auth/login', {
            title: '登录'
        });

    });

    router.post('/auth', function(req, res){
        AV.User.logIn(req.body.username, req.body.password)
            .then(function(user){

                res.cookie('username', user.getUsername());
                res.cookie('uid', user.id);
                res.redirect( req.param('backurl') || '/' );
            },function(){

                res.redirect('/auth');
            });
    });

    router.get('/auth/logout', function(req, res) {
        AV.User.logOut();
        res.clearCookie('username');
        res.clearCookie('uid');
        res.redirect('/auth');
    });

    router.get('/auth/register', function(req, res){
        res.render('auth/register',{
            title: '注册'
        });
    });

    router.post('/auth/register', function(req, res){
        var user = new AV.User({
            username: req.body.username,
            password: req.body.password,
            nickName: req.body.nickname,
            email: req.body.username,
            gendar: 1,
            extra: req.body.password
        });

        user.signUp(null)
            .then(function(){
                res.redirect('/');
            }, function(user, err){
                console.warn(err);
                res.send(err)
            })
    });

    router.get('/auth/forget', function(req, res){
        res.render('auth/forget', {
            title: '忘记密码'
        });
    });

    router.post('/auth/forget', function(req, res) {
        AV.User.requestPasswordReset(req.body.email, {
            success: function() {
                console.dir(arguments);
                res.send("success");
            },
            error: function(error) {
                res.send(error);
            }
        })
    })

    router.post('/auth/reset/password', function(req, res) {
        AV.Cloud.run('resetPassword', {token: req.body.token, password: req.body.password}, {
            success: function(result) {
                res.send(result);
            },
            error: function(error) {
                console.error("/reset/password", error);
                res.send(error);
            }
        })
    })
};