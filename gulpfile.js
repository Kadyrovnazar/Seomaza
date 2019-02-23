const { series, dest, parallel, src, watch } = require('gulp');
const browsersync = require("browser-sync").create();
const cssnano = require("gulp-cssnano");
const googleWebFonts = require('gulp-google-webfonts');
const rename = require("gulp-rename");
const autoprefixer = require("gulp-autoprefixer");

const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const del = require('del');

const clean = () => del(['dist']);
// BrowserSync
const browserSync = (done) => {
  browsersync.init({
    server: {
      baseDir: "./dist/"
    },
    port: 3000,
    // proxy:{
    //   target:"http://domadoma.dev",
    // }
  });
  done();
}

const browserSyncReload = (done) => {
  browsersync.reload();
  done();
}

const css = () => {
  return src('./sass/**/*.scss')
    .pipe(sass({
      includePaths: require('node-normalize-scss').includePaths
    }).on('error', sass.logError))
    .pipe(rename({ suffix: ".min"}))
    .pipe(autoprefixer())
    .pipe(cssnano({
      discardComments: {
        removeAll: true,
      }
    }))
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

const fonts = () => {
  return src('./fonts.list')
    .pipe(googleWebFonts({
      fontsDir: 'fonts/',
      cssDir: 'css/',
      cssFilename: 'googleFonts.css',
      relativePaths: true,
    }))
    .pipe(dest('./dist/'));
}

const fontawesome = () => {
  return src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
  .pipe(dest('./dist/webfonts/'));
}
// const minifyGoogleFonts = () => {
//   return src('dist/css/googleFonts.css')
//   .pipe(rename({suffix: ".min"}))
//   .pipe(autoprefixer())
//   .pipe(cssnano({
//   }))
//   .pipe(dest('/dist/css'))
// }

const images = () => src('./images/**/*').pipe(dest('./dist/images'));

const build = series(clean, parallel(html, images, fontawesome, fonts, css, js));
const watchFiles = () => {
  watch('./sass/**/*.scss', css);
  watch('./images//*', images)
  watch('./templates/**/*.html', html)
  watch('dist', browserSyncReload)
}

const runDev = series(build, parallel(browserSync, watchFiles))

exports.css = css;
exports.clean = clean;
exports.runDev = runDev;
exports.build = build;
exports.default = build;











