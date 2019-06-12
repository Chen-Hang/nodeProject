var gulp = require('gulp');
var uglify = require('gulp-uglify') //压缩js文件
var rename = require('gulp-rename') //重命名文件
var cssnano = require('gulp-cssnano') //压缩css文件
var prefix = require('gulp-autoprefixer') // 自动前缀
var less = require('gulp-less') //less文件
var sass = require('gulp-sass') // 忽略错误，继续监听
var plumber = require('gulp-plumber')
var htmlmin = require('gulp-htmlmin') //压缩html
var imagemin = require('gulp-imagemin') //压缩图片
var rev = require('gulp-rev-append') //插入文件指纹（MD5）
var concat = require('gulp-concat') //合并文件
var clean = require('gulp-clean') //项目清理
var browserSync = require('browser-sync') // 动态更新代码
var reload = browserSync.reload
var nodemon = require('gulp-nodemon')
// 相比 supervisor ，nodemon 的优点包括：更轻量级，内存占用更小。使用更加方便，更容易进行扩展等。
var watchPath = require('gulp-watch-path') // 监听变化的文件
var babel = require('gulp-babel') // 编译js
var combiner = require('stream-combiner2') // 忽略js错误，继续执行gulp
var gutil = require('gulp-util') // gulp异常捕获插件
var spritesmith = require('gulp.spritesmith') // 生成雪碧图
var zip = require('gulp-zip') // 生成zip
var step = require('gulp-sequence'); // 同步任务


//编译es6压缩
gulp.task('convertJS', function () {
	return gulp.src('public/js/**/*.js')
		.pipe(babel())
		.pipe(uglify())
		// .pipe(rename({ extname: '.min.js' }))
		// 这会输出一个压缩过的并且重命名为 foo.min.js 的文件
		.pipe(rev())
		.pipe(gulp.dest('../public/dist/js/'))
		// 文件变化时实时刷新浏览器
		.pipe(reload({
			stream: true
		}));
})
//编译sass
gulp.task('convertSass', function () {
	return gulp.src('../public/css/**/*.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(sass())
		.pipe(prefix())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('../public/dist/css/'))
		.pipe(reload({
			stream: true
		}));
});

// 合并并压缩css
gulp.task('convertCSS', function () {
	//   return gulp.src(['src/css/**/*.css'])
	return gulp.src(['../public/css/**/*.css'])
		// 忽略错误检查
		.pipe(plumber())
		// 文件合并为一个文件app.css
		//  .pipe(concat('app.css'))
		.pipe(cssnano())
		.pipe(prefix())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(rev())
		.pipe(gulp.dest('../public/dist/css/'));
});

// gulp.task('server', ['convertJS','convertSass','convertCSS'],function() {
// 		browserSync({
// 		  server: {
// 			baseDir: './dist/'
// 		  }
// 		});
// 		gulp.watch(['build/*.less'],['less']);
// 		gulp.watch(['build/*.js'],['js']);
// 		gulp.watch(['build/*.html'],['html']);
// 	});

// 开启 Express 服务
gulp.task('nodemon', function (cb) {
	var started = false;
	return nodemon({
		script: 'bin/www'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		// thanks @matthisk
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('server', ['convertJS', 'convertSass', 'convertCSS','nodemon'], function () {
	nodemon({
		script: 'bin/www',
		// 忽略部分对程序运行无影响的文件的改动，nodemon只监视js文件，可用ext项来扩展别的文件类型
		ignore: ["gulpfile.js", "node_modules/", "public/**/*.*"],
		env: {
			'NODE_ENV': 'development'
		}
	}).on('start', function () {
		browserSync.init({
			proxy: 'http://localhost:3000',
			files: ["public/**/*.*", "views/**", "routes/**"],
			port: 3000
		}, function () {
			console.log("browser refreshed.");
		});
	});
});