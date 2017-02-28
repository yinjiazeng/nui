var gulp = require('gulp');
var uglify = require('gulp-uglify');
var assetrev = require('gulp-asset-rev');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var nui = require('gulp-nui');
var nunjucksRender = require('gulp-nunjucks-render');

gulp.task('concat', function(){
	return gulp.src(['./src/nui.js',
              './src/util.js',
              './src/template.js',
              './src/component.js'
          ])
     .pipe(concat('nui.js'))
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

var config = {
	paths:{
		base:__dirname+'/',
		cpns:'/src/components'
	},
	alias:{
		'placeholder':'{cpns}/placeholder',
        'layer':'{cpns}/layer',
        'layer.ext':'{cpns}/layer.ext'
	}
}

gulp.task('nui', ['nunjucks'], function(){
    gulp.src(['./pages/**/*.html'])
		.pipe(nui(config))
		.pipe(gulp.dest('./pages'))
	gulp.src(['./index.html'])
		.pipe(nui(config))
		.pipe(gulp.dest('./'))
});

gulp.task('assetrev', ['nunjucks'], function(){
    gulp.src(['./pages/**/*.html'])
		.pipe(assetrev())
		.pipe(gulp.dest('./pages'))
	gulp.src(['./index.html'])
		.pipe(assetrev())
		.pipe(gulp.dest('./'))
});

gulp.task('nunjucks', function(){
  return gulp.src('./html/**/*.html')
  .pipe(nunjucksRender({
      path:'./tpl'
    }))
  .pipe(gulp.dest('./'))
});

gulp.task('watch', function(){
	gulp.watch(['./src/*.js'], ['concat']);
	gulp.watch(['./src/components/*.js', './pages/**/*.+(js|css)'], ['nui']);
	gulp.watch(['./dest/*.js', './assets/**/*.+(js|css|jpg|png|gif)'], ['assetrev']);
	gulp.watch(['./html/**/*.html', './tpl/*.tpl'], ['nunjucks', 'assetrev', 'nui']);
});

gulp.task('default', ['concat', 'nunjucks', 'assetrev', 'nui', 'watch']);
