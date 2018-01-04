var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var nui = require('gulp-nui');
var nunjucks = require('gulp-nunjucks-render');
var babel = require('babel-core');

gulp.task('concat', function() {
    gulp.src(['./lib/nui.js'])
        .pipe(uglify({
            mangle: true,
            output: {
                keep_quoted_props: true
            }
        }))
        .pipe(rename('nui-min.js'))
        .pipe(gulp.dest('./lib/'))
});

var options = {
    url:'./config.js',
    jsmin:null,
    cssmin:null,
    syncAsset:'node',
    filterPath: function(src) {
        return src.replace(/^\/nui\//, this.paths.base)
    }
}

gulp.task('nunjucks', function() {
    return gulp.src('./html/**/*.html')
        .pipe(nunjucks({
            path: ['./tpl', './html']
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('revhtml', ['nunjucks'], function(){
    gulp.src(['./pages/**/*.html'])
        .pipe(nui(options))
        .pipe(gulp.dest('./pages'))

    gulp.src(['./index.html'])
        .pipe(nui(options))
        .pipe(gulp.dest('./'))
})

gulp.task('revcss', function(){
    gulp.src(['./{pages,assets,lib}/**/*.{css,less}'])
        .pipe(nui())
        .pipe(gulp.dest('./'))
})

gulp.task('watch', function() {    
    gulp.watch(['{pages,assets}/**/*.{js,css,less}', '!{pages,assets}/**/*-min.{js,css}','!assets/script/config.js'], ['revhtml']);
    gulp.watch(['{pages,assets}/**/*.{jpg,png,gif,eot,svg,ttf,woff}'], ['revcss']);
    gulp.watch(['lib/**/*.{js,css,less}'], ['concat', 'revhtml']);
    gulp.watch(['html/**/*.html', 'tpl/*.tpl'], ['nunjucks', 'revhtml']);
});

gulp.task('default', ['concat', 'revhtml', 'revcss', 'watch']);