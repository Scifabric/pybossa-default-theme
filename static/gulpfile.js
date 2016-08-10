var gulp       = require('gulp');  
var less       = require('gulp-less');  
var minifyCSS  = require('gulp-minify-css');  

var runSequence = require('run-sequence');

var bower = require('gulp-bower');

var amnestyThemeFolder = './amnesty-theme';
var destFolder = './results-page';

gulp.task('copy', function(){
    gulp.src([amnestyThemeFolder + '/static/img/results-page/**/*.*'], {base: amnestyThemeFolder + '/static/img/results-page'})
    .pipe(gulp.dest('./img/results-page'));
});


gulp.task('bower', function() {
  return bower({cwd: amnestyThemeFolder});
});


/* Task to compile less */
var amnestyLessFolder = amnestyThemeFolder + '/static/bootstrap/less';
gulp.task('compile-less:custom-bootstrap', function() {  
  return gulp.src(amnestyLessFolder + '/bootstrap.less')
    .pipe(less())
    .pipe(gulp.dest(amnestyThemeFolder + '/static'));
});

gulp.task('compile-less:amnesty-style', function() {  
  return gulp.src(amnestyLessFolder + '/amnesty/amnesty.less')
    .pipe(less())
    .pipe(gulp.dest(amnestyThemeFolder + '/static'));
});

gulp.task('compile-less:page-style', function() {  
  return gulp.src(amnestyLessFolder + '/pages/results-page.less')
    .pipe(less())
    .pipe(gulp.dest(amnestyThemeFolder + '/static'));
});

gulp.task('compile-less', ['compile-less:custom-bootstrap', 'compile-less:amnesty-style', 'compile-less:page-style']);

/* Task when running `gulp` from terminal */
gulp.task('default', function(){
  runSequence('bower', 'compile-less', 'copy');
});

