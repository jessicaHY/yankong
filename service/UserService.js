/**
 * Created by lj on 15-6-5.
 */

var AV = require('leanengine');
var ResultJson = require('../utils/resultJson').result;

var UserService = AV.Object.extend('UserService', {
    getUser: function( key, value ){

        if( arguments.length == 1 ){
            value = key;
            key = 'objectId';
        }

        return new AV.Query(AV.User).equalTo(key, value).first().then(function(user){

            if( !user ){
                return ResultJson.failNotExist();
            }

            return ResultJson.success(user);

        }, function(err){
            console.error( err );
            return ResultJson.failServerFail();
        })
    }
});


exports.service = new UserService();