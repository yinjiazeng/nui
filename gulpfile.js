var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

gulp.task('concat', function(){
	gulp.src(['./src/nui.js',
              './src/util.js',
              './src/template.js',
              './src/template.ext.js',
              './src/component.js',
              './src/placeholder.js',
              './src/layer.js',
              './src/layer.ext.js'
          ])
     .pipe(concat('nui.js'))
     .pipe(gulp.dest('./dest'))
     .pipe(uglify({
    	 //mangle:false,
    	 output:{
    		 keep_quoted_props:true
    	 }
     }))
     .pipe(rename('nui.min.js'))
     .pipe(gulp.dest('./dest'))
});

gulp.task('watch', function(){
	gulp.watch(['./src/*.js'], ['concat']);
});

gulp.task('default', ['concat', 'watch']);
