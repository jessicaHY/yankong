/**
 * Created by Yinxiong on 2014-04-25.
 */

var _bower_paths = '../../bower_components';
console.log("main " + _bower_paths)
requirejs.config({
    paths: {
        jquery      : _bower_paths + '/jquery/dist/jquery.min',
        core        : './core'
    }
});

require(['jquery', 'core'], function($, core){
    console.log("main require")
    if(_inlineCodes && _inlineCodes.length) {
        _inlineCodes.map(function(fn) {
            typeof fn == 'function' && fn();
        })
    }
});