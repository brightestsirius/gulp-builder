let {src, dest, series, watch, parallel} = require('gulp');
let fileInclude = require('gulp-file-include');
let sass = require('gulp-dart-sass');
let sourcemaps = require('gulp-sourcemaps');
let cleanCss = require('gulp-clean-css');
let autoprefixer = require('gulp-autoprefixer');
let rename = require('gulp-rename');

let svgSprite = require('gulp-svg-sprite');

const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const terser = require('gulp-terser');

let ttf2wof = require('gulp-ttf2woff');
let ttf2wof2 = require('gulp-ttf2woff2');

let del = require('del');

let mode = require('gulp-mode')();
let browserSync = require('browser-sync').create();

let html = () => {
	return src('./src/*.html')
		.pipe(fileInclude({  // труба
	      prefix: '@',
	      basepath: '@file'
	    }))
		.pipe(dest('./APP'))
		.pipe(browserSync.stream())
}

let styles = () => ( src('./src/styles/style.sass')
					.pipe(mode.development(sourcemaps.init()))
					.pipe(sass().on('error', sass.logError))
					.pipe(cleanCss({
						level: 2
					}))
					.pipe(autoprefixer({cascade: false}))
					.pipe(rename({
						suffix: '.min'
					}))
					.pipe(mode.development(sourcemaps.write('.')))
					.pipe(dest('./APP/styles/'))
					.pipe(browserSync.stream())
)

let images = () => {
	return src(['./src/images/**/*.png','./src/images/**/*.jpeg'])
		.pipe(dest('./APP/images'))
		.pipe(browserSync.stream());
}

let sprite = () => {
	return src('./src/images/*.svg')
		.pipe(svgSprite({
			mode: {
				stack: {
					sprite: '../sprite.svg'
				}
			}
		}))
		.pipe(dest('./APP/images'))
		.pipe(browserSync.stream());
}

let fonts = () => {
	src('./src/fonts/*.ttf')
		.pipe(ttf2wof())
		.pipe(dest('./APP/fonts'))
		.pipe(browserSync.stream());

	return src('./src/fonts/*.ttf')
		.pipe(ttf2wof2())
		.pipe(dest('./APP/fonts'))
		.pipe(browserSync.stream());
}

let scripts = () => {
	return src('src/js/*.js')
	    .pipe(babel({
	      presets: ['@babel/env']
	    }))
	    .pipe(webpack({
	      mode: 'development',
	      devtool: 'inline-source-map'
	    }))
	    .pipe(mode.development(sourcemaps.init()))
	    .pipe(rename('app.min.js'))
	    .pipe(mode.production(terser({output:{comments: false}})))
	    .pipe(mode.development(sourcemaps.write()))
	    .pipe(dest('./APP/js'))
	    .pipe(browserSync.stream());
}

let json = () => {
	return src('./src/json/*.json')
		.pipe(dest('./APP/json'))
		.pipe(browserSync.stream());
}

let clean = () => {
	return del(['APP/*']);
}

let watchFiles = () => {
	browserSync.init({
        server: {
            baseDir: "./app"
        }
    });

    watch('./src/*.html', html);
    watch('./src/styles/style.sass', styles);
    watch(['./src/images/**/*.png','./src/images/**/*.jpeg'], images);
    watch('./src/images/*.svg', sprite);
    watch('./src/fonts/*.ttf', ttf2wof);
    watch('./src/fonts/*.ttf', ttf2wof2);
    watch('./src/js/*.js', scripts);
    watch('./src/json/*.json', json);
}

exports.htmlTask = html;
exports.styleTask = styles;
exports.spriteTask = sprite;
exports.fontsTask = fonts;
exports.scriptsTask = scripts;

exports.default = series(clean, parallel(html, images, sprite, json, scripts), fonts, styles, watchFiles);
exports.build = series(clean, parallel(html, images, sprite, json, scripts), fonts, styles);
