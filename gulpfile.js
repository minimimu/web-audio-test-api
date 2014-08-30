"use strict";

var gulp = require("gulp");
var jshint   = require("gulp-jshint");
var mocha    = require("gulp-mocha");
var istanbul = require("gulp-istanbul");

gulp.task("lint", function() {
  return gulp.src([ "gulpfile.js", "web-audio-mock.js", "test/**/*.js" ])
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter(require("jshint-stylish")))
    .pipe(jshint.reporter("fail"));
});

gulp.task("test", function() {
  require("./test/bootstrap/bootstrap");
  return gulp.src("test/**/*.js")
    .pipe(mocha());
});

gulp.task("cover", function(cb) {
  require("./test/bootstrap/bootstrap");
  gulp.src("web-audio-mock.js")
    .pipe(istanbul())
    .on("finish", function() {
      return gulp.src("test/**/*.js")
        .pipe(mocha())
        .pipe(istanbul.writeReports("coverage"))
        .on("end", cb);
    });
});

gulp.task("travis", [ "lint", "cover" ]);
gulp.task("default", [ "lint", "cover" ]);