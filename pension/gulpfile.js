var gulp = require('gulp');
var browserSync = require('browser-sync');  
var reload = browserSync.reload;
var sass = require('gulp-sass'); //文件删除模块
var prefix = require('gulp-autoprefixer');  //自动前缀
var nodemon = require('gulp-nodemon'); //项目自动重启
var sourcemaps = require('gulp-sourcemaps');  //sassmaps，生成的css文件下面会加上这个
var rename = require('gulp-rename'); //重命名
var del = require('del'); //文件删除模块
var uglify = require('gulp-uglify'); //js压缩插件
var htmlmin = require('gulp-htmlmin') //压缩html

gulp.task('sass', function() {
    return gulp
        .src(['./sass/*.scss'])
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: 'compact'
        }).on('error', sass.logError))
        .pipe(prefix('last 2 versions', '> 1%', 'ie8', 'Android 2'))
        .pipe(sourcemaps.write())
        // .pipe(rename({                      // Renames the merged CSS file
        //     basename: 'style',              // The file name
        //     extname: '.css'                 // The file extension
        // }))
        .pipe(gulp.dest('./public/css'))
        .pipe(reload({
            stream: true
        }));
});

// 压缩html
gulp.task('convertHTML', function(){
      return gulp.src('views/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        // .pipe(rev())  指纹md5
        .pipe(gulp.dest('public/views'));
});
//编译压缩js
gulp.task('convertJS', function() {
    return gulp.src(['javascripts/**/*.js'])
        .pipe(uglify())
        .pipe(gulp.dest('public/js'))
        .pipe(reload({
			stream: true
		}));
});

//
gulp.task('nodemon', function(cb) {
    var called = false;
    return nodemon({
        script: 'bin/www'
    }).on('start', function() {
        if (!called) {
            cb();
            called = true;
        }
    });
});

gulp.task('clean', function(cb) {
    del(['./dist'], cb)
});

gulp.task('sass-watch', ['sass'],browserSync.reload);
gulp.task('browser-sync', ['nodemon', 'sass','convertJS','convertHTML'], function() {
    browserSync.init(null, {
        proxy: 'http://localhost:3000',
        files: [
            'public/**/*.*', 'views/**/*.*', 'routes/*.*', 'sass/*.*','javascripts/**/*.*'
        ],
        browser: 'chrome',
        notify: false,
        port: 5000
    });
    gulp.watch('sass/*.scss', ['sass-watch']);
});



gulp.task('dist', ['clean','convertHTML', 'convertJS','sass']);
gulp.task('default', ['browser-sync']);