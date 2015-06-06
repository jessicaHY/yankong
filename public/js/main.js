/**
 * Created by Yinxiong on 2014-04-25.
 */

var _bower_paths = '../../bower_components';

requirejs.config({
    paths: {
        angular 	: _bower_paths + '/angular/angular.min',
        ngSanitize	: _bower_paths + '/angular-sanitize/angular-sanitize.min',
        ngCookies   : _bower_paths + '/angular-cookies/angular-cookies.min',
        ngResource  : _bower_paths + '/angular-resource/angular-resource.min',
        ngRoute     : _bower_paths + '/angular-route/angular-route.min',
        ngAnimate   : _bower_paths + '/angular-animate/angular-animate.min',
        loadingBar  : _bower_paths + '/angular-loading-bar/build/loading-bar.min',
        moment      : _bower_paths + '/momentjs/min/moment.min',
        momentZh    : _bower_paths + '/momentjs/lang/zh-cn',
        TweenMax    : _bower_paths + '/gsap/src/minified/TweenMax.min',
        ngFx        : _bower_paths + '/ng-Fx/dist/ng-Fx.min',
        JSZip       : _bower_paths + '/jszip/dist/jszip',
        FileSaver   : _bower_paths + '/FileSaver/FileSaver',
        Mustache    : _bower_paths + '/mustache/mustache',
        core        : './core'
    },
    shim: {
        TweenMax: {
            exports: 'TweenMax'
        },
        angular: {
            exports: 'angular'
        },
        ngSanitize: {
            deps: ['angular']
        },
        ngCookies: {
            deps: ['angular']
        },
        ngResource: {
            deps: ['angular']
        },
        ngRoute: {
            deps: ['angular']
        },
        ngAnimate: {
            deps: ['angular']
        },
        ngFx: {
            deps: ['angular', 'TweenMax']
        },
        loadingBar: {
            deps: ['angular']
        },
        FileSaver: {
            exports: 'FileSaver'
        },
        JSZip: {
            exports: 'JSZip'
        },
        Mustache: {
            exports: 'Mustache'
        }
    }
});

require(['angular', 'core'], function(ng, core){

    $(function(){

        ng.forEach(_inlineCodes, function(fn){
            typeof fn === 'function' && fn()
        });

        var ctrl = ng.element('body'),
            path = ctrl.data('path'),
            ctrlString = ctrl.attr('ng-controller');

        var reqs = [
            'ngSanitize',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngAnimate',
            'loadingBar',
            './services/index',
            './filters/index',
            './directives/index',
            './controllers/index'
        ];

        var deps = [
            'ngSanitize',
            'ngCookies',
            'ngResource',
            'ngRoute',
            'ngAnimate',
            'chieffancypants.loadingBar',
            'app.services',
            'app.filters',
            'app.directives',
            'app.controllers'
        ];

        if( path ){
            reqs.push('./controllers/'+path+'/'+ctrlString);
            deps.push('app.'+path);
        }

        require(reqs, function(){

            ng.module('app', deps)
//            .config(function($httpProvider){
//                $httpProvider.defaults.transformRequest = function(data){
//                    if( data == undefined ){
//                        return data;
//                    }
//                    return $.param(data);
//                };
//                $httpProvider.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
//            });

            ng.bootstrap(document, ['app']);

            core.lazyLoad({
                context: 'body'
            });
        });

    })
});