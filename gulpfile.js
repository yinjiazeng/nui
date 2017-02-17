var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var nuirev = require('nui-rev');
var nuiconcat = require('nui-concat');

gulp.task('concat', function(){
	gulp.src(['./src/nui.js',
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

gulp.task('nuiconcat', function(){
    gulp.src(['./demo/**/*.html'])
		.pipe(nuiconcat(config))
});

gulp.task('nuirev', ['nuiconcat'], function(){
    gulp.src(['./demo/**/*.html'])
		.pipe(nuirev(config))
		.pipe(gulp.dest('./demo/'))
});

gulp.task('watch', function(){
	gulp.watch(['./src/**/*.js'], ['concat']);
    gulp.watch(['./demo/**/*.js'], ['nuirev']);
});

gulp.task('default', ['concat', 'nuirev', 'watch']);
