var gulp = require('gulp');
var del = require('del');
var minifyCSS = require('gulp-csso');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

const BUILD_DIR = 'build/'
const CSS_BUILD_DIR = `${BUILD_DIR}css/`
const JS_BUILD_DIR = `${BUILD_DIR}js/`
const CSS_DIR = 'css/'
const JS_DIR = 'js/'

const PLAYER_JS = 'player.min.js'
const PLAYER_CSS = 'player.min.css'

gulp.task('playercss', function(){
  return gulp.src(player_css, {base: CSS_DIR})
    .pipe(concat(PLAYER_CSS))
    .pipe(minifyCSS())
    .pipe(gulp.dest(CSS_BUILD_DIR))
});

gulp.task('playerjs', function(){
  return gulp.src(player_scripts, {base: JS_DIR})
    .pipe(sourcemaps.init())
    .pipe(concat(PLAYER_JS))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(JS_BUILD_DIR))
});

gulp.task('clean', function() {
  return del([BUILD_DIR])
})

gulp.task('player', gulp.series('playerjs', 'playercss'))
gulp.task('default', gulp.series('player'))

const player_css = "css/player.css"

const player_scripts = [
  "js/Ayamel.js",
  "js/Resource.js",
  "js/swfobject.js",
  "js/Ayamel.js",
  "js/Text.js",
  "js/annotator.js",
  "js/Translator.js",
  "js/AnimationHandler.js",
  "js/AyamelPlayer.js",
  "js/CaptionsTraversal.js",
  "js/CaptionTrackLoader.js",
  "js/ControlBar.js",
  "js/FullScreenHandler.js",
  "js/KeyBinder.js",
  "js/LangCodes.js",
  "js/MediaPlayer.js",
  "js/Sidebar.js",
  "js/SidebarTab.js",
  "js/SoundManager.js",
  "js/Mobile.js",
  "js/ProgressBar.js",
  "js/controls/CaptionsMenu.js",
  "js/controls/AnnotationsMenu.js",
  "js/controls/FullScreenButton.js",
  "js/controls/LastCaptionButton.js",
  "js/controls/PlayButton.js",
  "js/controls/RateSlider.js",
  "js/controls/SliderBar.js",
  "js/controls/TimeCode.js",
  "js/controls/VolumeSlider.js",
  "js/plugins/flowplayer/flowplayer-3.2.12.min.js",
  "js/plugins/markdown/markdown.min.js",
  "js/plugins/hls/HLSPlayer.min.js",
  "js/plugins/dash/dash.all.js",
  "js/plugins/basicImage.js",
  "js/plugins/html5Audio.js",
  "js/plugins/html5Video.js",
  "js/plugins/flashVideo.js",
  "js/plugins/HLSVideo.js",
  "js/plugins/dashVideo.js",
  "js/plugins/brightcove.js",
  "js/plugins/scola.js",
  "js/plugins/youtube.js",
  "js/plugins/ooyala.js",
  "js/plugins/vimeo.js",
  "js/plugins/transcriptText.js",
  "js/plugins/markdownText.js",
  "js/plugins/plainText.js",
  "js/plugins/timedFallback.js"
]
