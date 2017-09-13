const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')

let javascriptFiles = [
	"./app.js",
	"./workouts/define.js",
	"./workouts/log.js",
	"./user/auth.js"
]

gulp.task('bundle', function(){
	return gulp.src(javascriptFiles)
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(concat('bundle.js').on('error', function(e){
			console.log(e)
		})) //squish all files into one
		.pipe(uglify().on('error', function(e){
			console.log(e)
		}))
		.pipe(gulp.dest("./dist")) //save bundle.js
})
//default task when 'gulp' runs: bundle, starts web server, then watches for changes
gulp.task('watch', function(){
	gulp.watch(javascriptFiles, ['bundle'])
})
gulp.task('default', ['bundle', 'watch'])