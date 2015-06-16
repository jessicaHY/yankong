/**
 * Created by joan on 2014/5/8.
 */

var router = require('express').Router();
var CrabService = require('../service/CrabService').service;
var result      = require('../utils/resultJson').result;
var fs = require('fs');

router.get("/ajax/crab/add", function(req, res) {
    return CrabService.addCrab(req.params.name).then(function(obj) {
        res.send( result.success(obj) );
    }, function(error) {
        console.error(error);
        res.send(error);
    })
});

router.get("/crab/list", function(req, res) {
    return CrabService.listCrab(req.query.count || 10, req.query.page || 1).then(function(obj) {
        console.dir(arguments)
        res.send( result.success(obj) );
    }, function(error) {
        console.error(error);
        res.send(error);
    })
});

router.get("/ajax/crab/edit/:crabId", function(req, res) {
    return CrabService.editCrab(req.params.crabId, req.params.name).then(function(obj) {
        res.send( result.success(obj) );
    }, function(error) {
        console.error(error);
        res.send(error);
    })
});

router.get("/ajax/crab/del/:crabId", function(req, res) {
    return CrabService.delCrab(req.params.crabId).then(function(obj) {
        res.send( result.success(obj) );
    }, function(error) {
        console.error(error);
        res.send(error);
    })
});

router.get('/crab/upload', function(req, res) {
    res.render('manage/crab/crab_upload', {
        title: '敏感词'
    });
});

router.post('/crab/upload', function(req, res) {
    var file = req.files.crabFile;
    if(file) {
        fs.readFile(file.path, 'utf-8', function(err, content) {
            if(err) {
                console.dir(arguments)
                res.send("err occur");
            }
            var cs = content.replace(/\r/g, '').split('\n');
            cs.forEach(function(c) {
                CrabService.addCrab(c);
            });
            res.send(cs);
        })
    } else
        res.send("please select a file");
})

module.exports = router;
