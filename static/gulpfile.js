var gulp       = require('gulp');  
var browserSync = require('browser-sync').create();
var less       = require('gulp-less');  
var watch      = require('gulp-watch');  
var minifyCSS  = require('gulp-minify-css');  
var rename     = require('gulp-rename');  

var runSequence = require('run-sequence');

var clean = require('gulp-clean');

var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');

var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

var bower = require('gulp-bower');

var amnestyThemeFolder = './amnesty-theme';
var destFolder = './results-page';

gulp.task('copy', function(){
    gulp.src([amnestyThemeFolder + '/static/fonts/**/*.*'], {base: amnestyThemeFolder + '/static/fonts'})
    .pipe(gulp.dest(destFolder + '/css/fonts'));

    //as css and html location in amnesty theme repo is different with pybossa so we need to copy images to 3 locations
    gulp.src([amnestyThemeFolder + '/static/img/**/*.*'], {base: amnestyThemeFolder + '/static/img'})
    .pipe(gulp.dest(destFolder + '/img'));

    gulp.src([amnestyThemeFolder + '/static/img/**/*.*'], {base: amnestyThemeFolder + '/static/img'})
    .pipe(gulp.dest(destFolder + '/css/img'));

    gulp.src([amnestyThemeFolder + '/static/img/results-page/**/*.*'], {base: amnestyThemeFolder + '/static/img/results-page'})
    .pipe(gulp.dest('./img/results-page'));


    //copy js (pulled by bower)
    gulp.src([amnestyThemeFolder + '/libs/**/*.*'], {base: amnestyThemeFolder + '/libs'})
    .pipe(gulp.dest(destFolder + '/js/libs'));

    //copy custom js
    gulp.src([amnestyThemeFolder + '/static/js/**/*.*'], {base: amnestyThemeFolder + '/static/js'})
    .pipe(gulp.dest(destFolder + '/js'));
});


gulp.task('bower', function() {
  return bower({cwd: amnestyThemeFolder});
});


/* Task to compile less */
var amnestyLessFolder = amnestyThemeFolder + '/static/bootstrap/less';
gulp.task('compile-less:custom-bootstrap', function() {  
  return gulp.src(amnestyLessFolder + '/bootstrap.less')
    .pipe(less())
    .pipe(rename('bootstrap.css'))
    .pipe(gulp.dest(destFolder + '/css/'));
});

gulp.task('compile-less:amnesty-style', function() {  
  return gulp.src(amnestyLessFolder + '/amnesty/amnesty.less')
    .pipe(less())
    .pipe(rename('amnesty.css'))
    .pipe(gulp.dest(destFolder + '/css/'));
});

gulp.task('compile-less:page-style', function() {  
  return gulp.src(amnestyLessFolder + '/pages/results-page.less')
    .pipe(less())
    .pipe(rename('results-page.css'))
    .pipe(gulp.dest(destFolder + '/css/'));
});

gulp.task('compile-less', ['compile-less:custom-bootstrap', 'compile-less:amnesty-style', 'compile-less:page-style']);

/* Task when running `gulp` from terminal */
gulp.task('default', function(){
  runSequence('bower', 'compile-less', 'copy');
});

