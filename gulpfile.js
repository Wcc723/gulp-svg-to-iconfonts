const gulp = require('gulp'),
  del = require('del'),
  plumber = require('gulp-plumber');

const async = require('async'),
  iconfont = require('gulp-iconfont'),
  consolidate = require('gulp-consolidate');

const path = {
  source: './source/',
  public: './public/'
}

gulp.task('clean', () => {
  return del(['./public/**/*'])
});

// icon fonts
gulp.task('iconfonts', function(done){
  const iconStream = gulp.src([path.source + 'icons/*.svg'])
    .pipe(iconfont({ fontName: 'icon' }));

  return async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function(glyphs, options) {
        gulp.src(path.source + 'css_template/iconfonts.css')
          .pipe(consolidate('lodash', {
            glyphs: glyphs,
            fontName: 'icon',
            fontPath: '../fonts/', 
            className: 'all-my-class'
          }))
          .pipe(gulp.dest(path.public + 'stylesheets'))
          .on('finish', cb);
      });
    },
    function handleFonts (cb) {
      iconStream
        .pipe(gulp.dest(path.public + 'fonts/'))
        .on('finish', cb);
    }
  ], done);
});


// 其它不編譯的物件
const objs = ['./source/**/**.html'];

gulp.task('others', function() {
  return gulp
    .src(objs)
    .pipe(plumber())
    .pipe(gulp.dest(path.public));
});

gulp.task('default', gulp.series(['clean', 'iconfonts', 'others']));

