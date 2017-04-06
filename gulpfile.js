var gulp = require('gulp');
var path = require('path');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var watch = require('gulp-nuiwatch');
var nui = require('gulp-nui');
var nunjucks = require('gulp-nunjucks-render');

gulp.task('concat', function() {
    return gulp.src(['./src/nui.js',
            './src/util.js',
            './src/template.js',
            './src/component.js'
        ])
        .pipe(concat('nui-debug.js'))
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
    paths: {
        base: __dirname + '/',
        script: '/assets/script',
        style: '/assets/style',
        cpns: '/src/components',
        light: '/src/components/highlight'
    },
    alias: {
        placeholder: '{cpns}/placeholder',
        highlight: '{light}/highlight'
    },
    jsdebug: true,
    filterPath: function(src) {
        return src.replace(/^\/nui\//, this.paths.base)
    }
}

gulp.task('nunjucks', function() {
    return gulp.src('./html/**/*.html')
        .pipe(nunjucks({
            path: './tpl'
        }))
        .pipe(nui(options))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', function() {
    watch(['./src/components/**/*.js', './pages/**/*.!(html)', './dist/*.js', './assets/**/*.*', '!./**/*-{debug,min}.{js,css}'],
        function(watcher) {
            options.watcher = watcher;
            gulp.src(['./pages/**/*.html'])
                .pipe(nui(options))
                .pipe(gulp.dest('./pages'))

            gulp.src(['./index.html'])
                .pipe(nui(options))
                .pipe(gulp.dest('./'))
        })
    gulp.watch(['./src/*.js'], ['concat']);
    gulp.watch(['./html/**/*.html', './tpl/*.tpl'], ['nunjucks']);
});

gulp.task('default', ['concat', 'nunjucks', 'watch']);