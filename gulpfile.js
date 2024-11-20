const {src, dest, watch, parallel, series} = require('gulp');

const scss = require('gulp-sass')(require('sass'));
const cleancss = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const webpack = require('webpack-stream');
const rename = require('gulp-rename');
const fileInclude = require('gulp-file-include');
const flatten = require('gulp-flatten');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const vinylFtp = require('vinyl-ftp');
const path = require("path");


//components

const components = {
    textimage: false,
    infocards: false,
    iconscards: false,
    randomcards: false,
    smallslider: false,
    form: false,
    videoinfocards: false,
    partners: false
}

//check components status

function checkOnComponentScripts(){
    let resultArray = [];
    for (let comp in components) {
        if(components[comp] === true){
            resultArray.push('app/components/'+comp+'/js/*.js');
        }
    }
    return resultArray;
}

function checkOnComponentStyles(){
    let resultArray = [];
    for (let comp in components) {
        if(components[comp] === true){
            resultArray.push('app/components/'+comp+'/scss/*.scss');
        }
    }
    return resultArray;
}

function checkOnComponentResources(){
    let resultArray = [];
    for (let comp in components) {
        if(components[comp] === true){
            resultArray.push('app/components/'+comp+'/resources/*');
        }
    }
    return resultArray;
}

function scripts(){
    let def = [
        checkOnComponentScripts(),
        'app/js/*.js',
        '!app/js/main.min.js',
    ]
    return src(def.flat())
    .pipe(
        webpack({
            output: {
              filename: 'main.js',
            },
            module: {
                rules: [
                    {
                        exclude: /(node_modules)/,
                        loader: 'babel-loader',
                    },
                ]
            },
          })
    )
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('app/js'))
    .pipe(browserSync.stream())
}

function styles(){
    let def = [
        'app/scss/style.scss',
        checkOnComponentStyles(),
    ]
    return src(def.flat())
        .pipe(scss({outputStyle: 'expanded'}))
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
        .pipe(cleancss(
            {
                level: 2
            }
        ))
        .pipe(dest('app/css'))
        .pipe(browserSync.stream())
}

function watching(){
    watch([
        'app/**/*.js',
        '!app/*js/main.min.js'
    ], scripts)
    watch([
        'app/**/*.scss'
    ], styles)
    watch(['app/**/*.html']).on('change', browserSync.reload)
    watch([
        'app/**/*'
    ], series(cleanDist, building, buildingResources, buildingHTML))
}

function browsersync(){
    browserSync.init({
        server: {
            baseDir: 'dist',
            index: 'page.html'
        }
    });
}

function cleanDist(){
    return src('dist')
        .pipe(clean())
}

function building(){
    return src([
        'app/geliusAssets/**',
        'app/css/style.min.css',
        'app/js/main.min.js',
        'app/index.html',
    ], {base : 'app'})
        .pipe(dest('dist'))
}

function buildingResources(){
    let def = [
        'app/resources/**/*',
        checkOnComponentResources(),
    ]
    return src(def.flat())
        .pipe(flatten({ includeParents: 0 }))
        .pipe(dest('dist/resources'))
}

function buildingHTML(){
    return src('app/**/[^_]*.html')
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(dest('dist'))
}

function ftp(){
    let conn = vinylFtp.create({
        host:     'alxrorel.ftp.tools',
        user:     'alxrorel_gelius',
        password: 'Alxrorel0100!',
        parallel: 10
    });

    return src([
        'app/**',
        'dist/**',
        'gulpfile.js',
        'package-lock.json',
        'package.json',
        '!node_modules',
    ], {base : './corporate-clients/', buffer: false})
    .pipe( conn.dest( '/oreldev.com/www/corporate-clients/'+path.basename(__dirname)+'/' ) );
}

exports.scripts = scripts;
exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.ftp = ftp;

exports.default = parallel(cleanDist, buildingResources, browsersync, watching, series(scripts, styles, building, buildingHTML));