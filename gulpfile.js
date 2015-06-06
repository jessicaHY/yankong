var gulp = require('gulp');
var swig = require('gulp-swig');
var miniCss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var colors = require('colors');

var swigDefaults = {
	defaults: {
		cache: false,
		varControls: ['<%','%>'],
		locals: {
			img_server: 'http://img.heiyanimg.com'
		}
	}
}

function getT( n ){
    return n > 9 ? n : '0' + n;
}

function info( path ){
    var s = (new Date).getMilliseconds();
    path = path.substring(path.indexOf('consume'), path.length);
    return function(){
        var d = new Date;
        var n = d.getMilliseconds() - s;
        var t = getT(d.getHours())+':'+ getT(d.getMinutes()) +':'+ getT(d.getSeconds());
        console.info('['+t.grey+']', 'Changed', path.cyan, 'after', (n+'ms').magenta);
    }
}

//gulp.task('scss', function(){
//    return gulp.src('scss/base.scss')
//        .pipe(sass())
//        .pipe(miniCss())
//        .pipe(gulp.dest('css/'))
//});

gulp.task('swig', function(){
    return gulp.src('cloud/src/*.html')
        .pipe(swig(swigDefaults))
        .pipe(gulp.dest('cloud/views/'))
});

gulp.task('watch', function(){
	//gulp.watch('scss/**/*.scss', ['scss']);

    gulp.watch('cloud/src/*.html', function(e){
        if( e.type === 'changed' ){
            var i = info(e.path);
            gulp.src(e.path, { base: 'cloud/src/'})
                .pipe(swig(swigDefaults))
                .pipe(gulp.dest('cloud/views/'));
            i();
        }
    });

    gulp.watch('cloud/src/inc/*.html', ['swig']);
});

gulp.task('default', ['swig','watch']);