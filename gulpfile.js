const { series, dest, parallel, src, watch } = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const googleWebFonts = require('gulp-google-webfonts');
const del = require('del');

const clean = () => del(['dist']);

const css = () => {
  return src('./sass/**/*.scss')
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    .pipe(dest('./dist/css'));
}

const html = () => {
  return src('./templates/**/*.html')
    .pipe(dest('./dist/'));
}

const js = () => {
  return src('./js/**/*.js')
    .pipe(dest('./dist/js'));
}

const images = () => src('./images/**/*').pipe(dest('./dist/images'));

const fonts = () => {
  return src('./fonts.list')
    .pipe(googleWebFonts({
      fontsDir: 'fonts/',
      cssDir: 'css/',
      cssFilename: 'googleFonts.css',
      relativePaths: true
    }))
    .pipe(dest('./dist/'));
}

const fontawesome = () => {
  return src('node_modules/@fortawesome-free/webfonts/*')
    .pipe(dest('./dist/webfonts/'));
}

const watchFiles = () => {
  watch('./sass/**/*.scss', css);
  watch('./images//*', images)
  watch('./templates/**/*.html', html)
}

const build = series(clean, parallel(html, images, fontawesome, fonts, css, js));
const runDev = series(build, watchFiles)

exports.css = css;
exports.clean = clean;
exports.runDev = runDev;
exports.build = build;
exports.default = build;