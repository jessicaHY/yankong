/**
 * Created by Yinxiong on 2014-05-09.
 */
var router = require('express').Router();
var AV = require('leanengine');

router.get('/404', function(req, res, next){
    // trigger a 404 since no other middleware
    // will match /404 after this one, and we're not
    // responding here
    res.render('404')
});

router.get('/403', function(req, res, next){
    // trigger a 403 error
    var err = new Error('not allowed!');
    err.status = 403;
    next(err);
});

router.get('/500', function(req, res, next){
    // trigger a generic (500) error
    next(new Error('keyboard cat!'));
});

module.exports = router;