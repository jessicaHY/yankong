/**
 * Created by languid on 14-5-7.
 */

var result          = require('cloud/utils/resultJson').result;
var _               = require('underscore');
var helper          = require('cloud/utils/helper');
var OBJECTSTATUS    = require('cloud/utils/const').OBJECTSTATUS;

var QueryService = AV.Object.extend('QueryService', {

    get: function( model, key, value, extra ){

        model = this._getModel( model );

        if( !model ){
            return AV.Promise.error( result.failParamError() );
        }

        var name, equalDetail = {};

        name = model.name;
        model = model.model;

        if( typeof key == 'object' && !_.isEmpty(key) ){
            equalDetail = key;
            extra = value;
        }else if( typeof key == 'string' ){
            if( typeof value == 'function' || arguments.length == 2 ){
                equalDetail['objectId'] = key;
                extra = value;
            }else if(value) {
                equalDetail[key] = value;
            }
        }else if( typeof key == 'function' ){
            extra = key;
        }

        extra = extra || helper.noop;

        return this.first(model, equalDetail, extra).then(function( data ){
            if( !data ){
                console.error('get ' + name + ' fail | where' + JSON.stringify(equalDetail) );
                return AV.Promise.error( result.failNotExist() )
            }
            return data;
        });
    },

    first: function( model, prop, extra, statusNormal ){
        return this.query(model, prop, extra, statusNormal, true)
    },

    find: function( model, prop, extra, statusNormal ){
        return this.query(model, prop, extra, statusNormal, false)
    },

    query: function( model, prop, extra, statusNormal, isFirst){
        model = this._getModel( model );

        if( !model ){
            return AV.Promise.error( result.failParamError() );
        }

        var equalDetail = {}, name;

        name = model.name;
        model = model.model;

        var query = new AV.Query( model );

        if( typeof prop === 'object' && !_.isEmpty(prop)){
            equalDetail = prop;
            if( typeof extra === 'boolean' ){
                statusNormal = extra;
                extra = helper.noop;
            }
        }else if( typeof prop === 'function' ){
            statusNormal = extra;
            extra = prop;
        }else if( typeof prop === 'boolean'){
            statusNormal = prop;
        }

        if( typeof statusNormal === 'string' ){
            query.equalTo('status', statusNormal == 'normal' ? OBJECTSTATUS.NORMAL : OBJECTSTATUS.DELETED );
        }else if( statusNormal ) {
            query.equalTo('status', OBJECTSTATUS.NORMAL);
        }

        extra = extra || helper.noop;

        _.forEach(equalDetail, function(value, key){
            if( key == '_include' ){
                value.map(function( include ){
                    query.include( include );
                })
            }else{
                query.equalTo(key, value);
            }
        });

        extra(query);

        return query[isFirst ? 'first' : 'find']().then(function( data ){
            return data;
        }, function( err ){

            console.error('find ' + name + ' fail | where' + query);
            console.error( err );
            return result.failServerFail();
        });
    },

    add: function( model, prop, existsProp, ifDelThenReset ){
        model = this._getModel( model );

        if( !model ){
            return new AV.Promise.error( result.failParamError() );
        }

        var name;
        name = model.name;
        model = model.model;

        var newModel = new model(prop);

        function save(){
            return newModel.save().then(function( data ){
                return data;
            }, function( err ){

                console.error('add model fail | where model = ' + name + ' & prop = ' + prop );
                console.error( err );
                return result.failServerFail();
            })
        }

        if( existsProp && typeof existsProp === 'object' && !_.isEmpty(existsProp) ){

            var q = new AV.Promise();

            this.get(model, existsProp).then(function( data){

                //如果是删除状态则重置对象状态
                if( ifDelThenReset && data.get('status') == OBJECTSTATUS.DELETED ){
                    data.save({
                        'status': OBJECTSTATUS.NORMAL
                    }).then(function( sort ){
                        q.resolve(sort)
                    }, function( err ){
                        q.reject( err );
                    })
                }else{
                    q.reject( result.failRepeated(data) )
                }

            },function(){
                save().then(function( crab ){
                    q.resolve(crab)
                }, function( err ){
                    q.reject( err );
                });
            });

            return q;

        }else{
            return save();
        }
    },

    update: function( model, id, prop, extra ){

        model = this._getModel( model, id );

        if( !model ){
            return AV.Promise.error( result.failParamError() );
        }

        var name;

        name = model.name;
        model = model.model;

        extra = extra || helper.noop;

        if( typeof prop == 'function' ){
            extra = prop;
        }else{
            model.set(prop);
        }

        extra( model );

        return model.save().then(function( data ){
            if( data ){
                return data;
            }
            return AV.Promise.error( result.failServerFail() );

        }, function( err ){

            console.log('update ' + name +' fail | where id = ' + id );
            console.log( err );
            return result.failServerFail(err);
        });
    },

    remove: function( model, id, destroy ){

        if( !destroy ){
            return this.update( model, id, {
                status: OBJECTSTATUS.DELETED
            });
        }else{
            return AV.Object.createWithoutData(model, id).destroy();
        }
    },

    list: function( model, page, count, prop, extra ){

        if( typeof prop == 'function' ){
            extra = prop;
            prop = null;
        }

        return this.find( model, prop, function(query){
            if( typeof page != 'object') {
                count = count || 10;
                page  = page  || 0;
                query.skip( count * page).limit(count);
            }
            ( extra || helper.noop )( query );
        });
    },

    _getModel: function( model, id){
        var name;
        if( typeof model == 'string' ){
            name = model;
            if( id ){
                model = AV.Object.createWithoutData(model, id);
            }else{
                model = AV.Object.extend( model );
            }
        }else if( typeof model == 'function' ){
            name = new model().className;
            if( id ){
                model = AV.Object.createWithoutData(name, id);
            }
        }else{
            return null;
        }
        return {
            name: name,
            model: model
        }
    },

    m: function( model, id ){
        return this._getModel(model, id).model;
    }
});

var service = new QueryService();

exports.service = service;