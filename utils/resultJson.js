/**
 * Created by lj on 15-6-5.
 */
var AV = require('leanengine');
var ResultCode = require('./const').ResultCode;
var ResultMessage = require('./const').ResultMessage;
var helper = require('./helper');
var ResultObject = AV.Object.extend('ResultObject', {
    success: function (object) {
        return {_result: true, data: object};
    },
    failNotExist: function(error) {
        return {_result: false, code: ResultCode.OBJECT_NOT_EXIST, message: ResultMessage.OBJECT_NOT_EXIST, error: error || null};
    },
    failNoRight: function(error) {
        return {_result: false, code: ResultCode.OBJECT_NO_RIGHT, message: ResultMessage.OBJECT_NO_RIGHT, error: error || null};
    },
    failNoLogin: function(error) {
        return {_result: false, code: ResultCode.OBJECT_NO_LOGIN, message: ResultMessage.OBJECT_NO_LOGIN, error: error || null};
    },
    failParamError: function(error) {
        return {_result: false, code: ResultCode.OBJECT_PARAM_ERROR, message: ResultMessage.OBJECT_PARAM_ERROR, error: error || null};
    },
    failRepeated: function(error) {
        return {_result: false, code: ResultCode.OBJECT_REPEATED, message: ResultMessage.OBJECT_REPEATED, error: error || null};
    },
    failServerFail: function(error) {
        return {_result: false, code: ResultCode.SERVER_FAIL, message: ResultMessage.SERVER_FAIL, error: error || null};
    },
    failVersionUpdate: function(error) {
        return {_result: false, code: ResultCode.VERSION_UPDATED, message: ResultMessage.VERSION_UPDATED, error: error || null};
    }
});

exports.result = new ResultObject();