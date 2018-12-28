var gulp = require('gulp');
var del = require('del');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

const BUILD_DIR = 'build/'
const CSS_BUILD_DIR = `${BUILD_DIR}css/`
const JS_BUILD_DIR = `${BUILD_DIR}js/`
const IMAGE_BUILD_DIR = `${BUILD_DIR}images/`
const CSS_DIR = 'css/'
const JS_DIR = 'js/'
const IMAGE_DIR = 'images/'

const PLAYER_CSS = 'player.min.css'
const YVIDEO_JS = 'yvideoplayer.min.js'
const PLUGINS_JS = 'mediaplugins.min.js'
const CONTROLS_JS = 'playercontrols.min.js'

const player_css = "css/player.css"
const player_js = [
  "Ayamel.js",
  "*"
].map((s)=>{return JS_DIR+s})

gulp.task('playercss', function(){
  return gulp.src(player_css, {base: CSS_DIR})
    .pipe(concat(PLAYER_CSS))
    .pipe(minifyCSS())
    .pipe(gulp.dest(CSS_BUILD_DIR))
});

gulp.task('clean', function() {
  return del([BUILD_DIR])
})

gulp.task('yvideoplayer', function() {
  return gulp.src(player_js, {base: JS_DIR})
    .pipe(sourcemaps.init())
    .pipe(concat(YVIDEO_JS))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(JS_BUILD_DIR))
})

gulp.task('mediaplugins', function() {
  return gulp.src(JS_DIR+'plugins/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat(PLUGINS_JS))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(JS_BUILD_DIR))
})

gulp.task('playercontrols', function() {
  return gulp.src(JS_DIR+'controls/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat(CONTROLS_JS))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(JS_BUILD_DIR))
})

gulp.task('images', function() {
  return gulp.src(IMAGE_DIR+"*.png")
    .pipe(gulp.dest(IMAGE_BUILD_DIR))
})

gulp.task('default', gulp.series('yvideoplayer', 'mediaplugins', 'playercontrols', 'playercss', 'images'))
