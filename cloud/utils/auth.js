/**
 * Created by lj on 15-6-5.
 */

exports.restrict = function( req, res, next){
    var user = AV.User.current();
    if( user || req.url.indexOf('/auth') == 0 ){
        next();
    }else{
        res.redirect('/auth?backurl='+req.url);
    }
}