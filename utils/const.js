/**
 * Created by lj on 15-6-5.
 */

exports.OBJECTSTATUS = {
    NORMAL : 0,
    DELETED : -1,
    OVER : 1
};

exports.COOKIENAMES = {
    DEVICEID : "dd",
    DEVICEINFO : "inf",
    DEVICETYPE : "dt",
    KEY : "#wmYSLaJMF*s?Pc!"
}

exports.DEVICES = {
    ANDROID: 1,
    IOS : 2
}

exports.GENDER = {
    0: 'MAN',
    1: 'WOMEN'
}

exports.ResultCode = {
    OBJECT_NOT_EXIST: 1,
    OBJECT_NO_RIGHT: 2,
    OBJECT_NO_LOGIN: 3,
    OBJECT_PARAM_ERROR: 4,
    SERVER_FAIL: 5,
    OBJECT_REPEATED: 6,
    VERSION_UPDATED : 7
}
exports.ResultMessage = {
    OBJECT_NOT_EXIST: '内容不存在',
    OBJECT_NO_RIGHT: '无权限',
    OBJECT_NO_LOGIN: '未登录',
    OBJECT_REPEATED: '重复操作',
    OBJECT_PARAM_ERROR: '请求参数异常',
    SERVER_FAIL: '服务器异常',
    VERSION_UPDATED: '请更新版本'
}