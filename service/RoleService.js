/**
 * Created by lj on 15-6-5.
 */

var AV = require('leanengine');
var QueryService    = require('./QueryService').service;
var UserService     = require('./UserService').service;
var result          = require('../utils/resultJson').result;

var RoleService = AV.Object.extend('RoleService', {
    _roles: {},
    getRole: function( name ){
        var service = this;

        if( !this._roles[name] ){
            return QueryService.get(AV.Role, 'name', name).then(function( role ){
                service._roles[name] = role;
            });
        }

        var q = new AV.Promise();
        q.resolve(this._roles[name]);

        console.dir(q)
        return q;
    },

    add: function(name, userFiled, userValue ){
        return this._baseEdit('add', name, userFiled, userValue);
    },

    remove: function( name, userFiled, userValue ){
        return this._baseEdit('remove', name, userFiled, userValue);
    },

    _baseEdit: function( type, name, userFiled, userValue ){
        if( type != 'remove' && type != 'add' ){
            var q = new AV.Promise();
            q.reject(null);
            return q;
        }

        if( typeof userValue === 'undefined' ){
            userValue = userFiled;
            userFiled = 'objectId';
        }

        return new AV.Query(AV.Role).equalTo('name','staff').first().then(function(role){
            return UserService.getUser(userFiled, userValue).then(function( userResult ){

                if( !userResult._result ){
                    return AV.Promise.error(result.failNotExist());
                }

                role.getUsers()[type](userResult.data);

                return role.save().then(function(){

                    return userResult;
                }, function( err ){

                    console.log('set role faile', err);
                    return result.failServerFail();
                })
            }, function( err ){

                console.log('get user faile', err);
                return result.failServerFail();
            });
        })
    }
});

exports.service = new RoleService();