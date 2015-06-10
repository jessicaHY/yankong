/**
 * Created by lj on 15-6-5.
 */

var AV = require('leanengine');
exports.restrict = function( req, res, next){
    var user = req.AV.user;
    if( user || req.url.indexOf('/auth') == 0 ){
        next();
    }else{
        res.redirect('/auth?backurl='+req.url);
    }
}