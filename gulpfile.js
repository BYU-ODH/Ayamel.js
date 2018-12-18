var gulp = require('gulp');
var del = require('del');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

const BUILD_DIR = 'build/'
const CSS_BUILD_DIR = `${BUILD_DIR}css/`
const JS_BUILD_DIR = `${BUILD_DIR}js/`
const CSS_DIR = 'css/'
const JS_DIR = 'lib/'

const PLAYER_JS = 'player.min.js'
const PLAYER_CSS = 'player.min.css'

gulp.task('playercss', function() {
  return gulp.src(player_css, {base: CSS_DIR})
    .pipe(concat(PLAYER_CSS))
    .pipe(minifyCSS())
    .pipe(gulp.dest(CSS_BUILD_DIR))
});

gulp.task('playerjs', function() {
  return gulp.src(player_scripts, {base: JS_DIR})
    .pipe(concat(PLAYER_JS))
    .pipe(uglify())
    .pipe(gulp.dest(JS_BUILD_DIR))
});

gulp.task('clean', function() {
  return del([BUILD_DIR])
})

gulp.task('images', function() {
  return gulp.src(['images/*'])
    .pipe(gulp.dest('build/images'))
})

gulp.task('player', gulp.series('playerjs', 'playercss', 'images'))
gulp.task('default', gulp.series('player'))

const player_css = "css/player.css"

