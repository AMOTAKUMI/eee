'use strict';

var path = {
  'imgPath': '../assets/img/',
  'sassPath': 'sass/',
  'cssPath': '../assets/css/',
  'jsPath': '../assets/js/',
  'rootPath': '../'
}

var gulp = require('gulp');
var compass = require('gulp-compass');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var plumber = require('gulp-plumber');

gulp.task('compass', function(){
  gulp.src(path.sassPath + '/**/*.scss')
    .pipe(plumber())
    .pipe(compass({
      config_file: 'config.rb',
      sass: path.sassPath,
      css: path.cssPath,
      image: path.imgPath
    }))
    .pipe(autoprefixer('last 2 version', 'ie 8', 'ie 7'))
    .pipe(gulp.dest(path.cssPath + '/'))
});

gulp.task('imagemin', function(){
  gulp.src(path.imgPath + '/**/*')
    .pipe(plumber())
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest(path.imgPath + '/'));
});

gulp.task('watch', function() {
  gulp.watch(path.sassPath + '/**/*.scss', function(event){
    gulp.run('compass')
  });
});

gulp.task('default', ['compass','imagemin','watch']);
