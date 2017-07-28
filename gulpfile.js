var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var nui = require('gulp-nui');
var nunjucks = require('gulp-nunjucks-render');

gulp.task('concat', function() {
    return gulp.src(['./src/nui.js',
            './src/util.js',
            './src/template.js',
            './src/events.js',
            './src/component.js'
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
    url:'./assets/script/config.js',
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