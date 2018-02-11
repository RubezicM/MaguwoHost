const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require ('gulp-autoprefixer');
const useref = require('gulp-useref');

// Paths to files
var paths = {
    styles:[
        'src/css/**/*.css'
    ],

    scripts:{
        js:[
            'src/scripts/main.js'
        ]
    },
    images:[
        'src/img/**/*'
    ],
    html:[
        'src/*.html'
    ]

};


// Compile Sass
gulp.task('sass',function(){
    return gulp.src(['src/sass/**/*.scss'])
        .pipe(sass()).on('error', sass.logError)
        //.pipe(cleanCSS({removeEmpty: true}))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.stream());
});


// build styles
gulp.task('styles', function() {
    return gulp.src(paths.styles)
        .pipe(sass().on('error',sass.logError))
        .pipe(autoprefixer('last 5 versions'))
        .pipe(concat('main.css'))
        .pipe(cleanCSS({ removeEmpty: true }))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
        .pipe(notify({ message: 'styles built' }));
});


//build scripts
gulp.task('scripts', function(){
    return gulp.src(paths.scripts.js)
        .pipe(uglify())
        .pipe(concat('minified.js'))
        .pipe(plumber())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(browserSync.stream())
        .pipe(notify({ message:'scripts built'}));
});

// watch scripts

gulp.task ('scripts:watch', function(){
    return gulp.src(paths.scripts.js)
    .pipe(browserSync.stream())
    .pipe(notify({message: 'scripts watched'}));
})
// move & compress images
gulp.task('images', function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest('dist/images'));

});
gulp.task('html',function(){
    return gulp.src(paths.html)
        .pipe(useref())
        .pipe(gulp.dest('dist/'))
});


// Watch & Serve
gulp.task('watch',function(){
    gulp.watch(['src/scripts/*.js'],['scripts:watch']);
    //gulp.watch(['src/css/*.css'],['styles']);
    gulp.watch(['src/sass/**/*.scss'], ['sass']);
    gulp.watch(['src/*.html']).on('change',browserSync.reload);
});


gulp.task('serve', ['sass','watch'],function(){
    browserSync.init({
        server: './src'
    });

});

gulp.task('build',['html','styles','scripts','images']);


gulp.task('default', ['watch','sass','scripts','serve']);
