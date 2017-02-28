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
		script:'/assets/script',
		style:'/assets/style',
		cpns:'/src/components'
	},
	alias:{
		'placeholder':'{cpns}/placeholder'
	}
}

gulp.task('nui', ['assetrev'], function(){
    // gulp.src(['./pages/**/*.html'])
	// 	.pipe(nui(config))
	// 	.pipe(gulp.dest('./pages'))
});

gulp.task('index', ['assetrevIndex'], function(){
	return gulp.src(['./index.html'])
		.pipe(nui(config))
		.pipe(gulp.dest('./'))
});

gulp.task('assetrev', function(){
    // return gulp.src(['./pages/**/*.html'])
	// 	.pipe(assetrev())
	// 	.pipe(gulp.dest('./pages'))
});

gulp.task('assetrevIndex', function(){
	// return gulp.src(['./index.html'])
	// 	.pipe(assetrev())
	// 	.pipe(gulp.dest('./'))
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
	gulp.watch(['./src/components/*.js', './pages/**/*.*', './assets/**/*.*'], ['index', 'nui']);
	gulp.watch(['./html/**/*.html', './tpl/*.tpl'], ['nunjucks', 'index', 'nui']);
});

gulp.task('default', ['concat', 'nunjucks', 'nui', 'index', 'watch']);
