var gulp = require('gulp');
var path = require('path');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var nui = require('gulp-nui');
var nunjucks = require('gulp-nunjucks-render');

gulp.task('concat', function() {
    gulp.src(['./src/load.js'])
        .pipe(rename('nui-load.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify({
            mangle: true,
            output: {
                keep_quoted_props: true
            }
        }))
        .pipe(rename('nui-load-min.js'))
        .pipe(gulp.dest('./dist'))

    gulp.src([
        './src/nui.js',
        './src/core/util.js',
        './src/core/events.js',
        './src/core/template.js',
        './src/core/component.js'
    ])
        .pipe(concat('nui.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify({
            mangle: true,
            output: {
                keep_quoted_props: true
            }
        }))
        .pipe(rename('nui-min.js'))
        .pipe(gulp.dest('./dist'))
});

var options = {
    url:'./config.js',
    jsmin:null,
    cssmin:null,
    filterPath: function(src) {
        return src.replace(/^\/nui\//, this.paths.base)
    }
}

gulp.task('nunjucks', function() {
    return gulp.src('./html/**/*.html')
        .pipe(nunjucks({
            path: './tpl'
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
    gulp.src(['./{pages,assets}/**/*.css'])
        .pipe(nui())
        .pipe(gulp.dest('./'))
})

gulp.task('watch', function() {    
    gulp.watch(['{pages,assets}/**/*.{js,css}', '!{pages,assets}/**/*-min.{js,css}','!assets/script/config.js'], ['revhtml']);
    gulp.watch(['{pages,assets}/**/*.{jpg,png,gif,eot,svg,ttf,woff}'], ['revcss']);
    gulp.watch(['src/**/*.js'], ['concat', 'revhtml']);
    gulp.watch(['html/**/*.html', 'tpl/*.tpl'], ['nunjucks', 'revhtml']);
});

gulp.task('default', ['concat', 'revhtml', 'revcss', 'watch']);