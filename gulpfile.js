'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var del = require('del');

var paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    maps: 'build/maps',
    dest: 'build/css/'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'build/scripts/'
  }
};

function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({outputStyle: 'compressed'})
    .on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.styles.dest));
};

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

function clean() {
  del([ dir.build ]);
}

var build = gulp.series(clean, gulp.parallel(styles, scripts));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;