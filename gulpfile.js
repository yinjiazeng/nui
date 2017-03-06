var gulp = require('gulp');
var uglify = require('gulp-uglify');
var assetrev = require('gulp-asset-rev');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var nui = require('gulp-nui');
var nunjucks = require('gulp-nunjucks-render');

gulp.task('concat', function(){
	return gulp.src(['./src/nui.js',
              './src/util.js',
              './src/template.js',
              './src/component.js'
          ])
     .pipe(concat('nui-debug.js'))
     .pipe(gulp.dest('./dest'))
     .pipe(uglify({
    	 mangle:true,
    	 output:{
    		 keep_quoted_props:true
    	 }
     }))
     .pipe(rename('nui-min.js'))
     .pipe(gulp.dest('./dest'))
});

gulp.task('mini', function(){
	return gulp.src(['./src/nui.js'])
     .pipe(uglify({
    	 mangle:true,
    	 output:{
    		 keep_quoted_props:true
    	 }
     }))
     .pipe(gulp.dest('./dest'))
});

var config = {
	paths:{
		base:__dirname+'/',
		script:'/assets/script',
		style:'/assets/style',
		cpns:'/src/components',
		light:'/src/components/highlight'
	},
	alias:{
		placeholder:'{cpns}/placeholder',
		highlight:'{light}/highlight'
	}
}

gulp.task('pages', function(){
    gulp.src(['./pages/**/*.html'])
		.pipe(assetrev())
		.pipe(nui(config))
		.pipe(gulp.dest('./pages'))
});

gulp.task('index', function(){
	return gulp.src(['./index.html'])
		.pipe(assetrev())
		.pipe(nui(config))
		.pipe(gulp.dest('./'))
});

gulp.task('nunjucks', function(){
  return gulp.src('./html/**/*.html')
  .pipe(nunjucks({
      path:'./tpl'
    }))
  .pipe(gulp.dest('./'))
});

gulp.task('watch', function(){
	gulp.watch(['./src/nui.js'], ['mini']);
	gulp.watch(['./src/*.js'], ['concat']);
	gulp.watch(['./html/**/*.html', './tpl/*.tpl'], ['nunjucks']);
	gulp.watch(['./index.html', './src/components/*.js', './assets/**/*.*'], ['index']);
	gulp.watch(['./pages/**/*.*', './src/components/*.js', './assets/**/*.*'], ['pages']);
});

gulp.task('default', ['mini', 'concat', 'nunjucks', 'watch']);
