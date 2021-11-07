'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const paths = {
  styles: {
    src: 'src/sass/**/*.scss',
    maps: 'build/maps',
    dest: 'build/css'
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'build/js'
  }
};

function styles() {
  del([paths.styles.dest]);
  return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({outputStyle: 'compressed'})
    .on('error', sass.logError))
    .pipe(sourcemaps.write('maps'))
    .pipe(gulp.dest(paths.styles.dest));
};

function scripts() {
  del([paths.scripts.dest]);
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    // .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;