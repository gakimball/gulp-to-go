# gulp-to-go

> Create a portable Gulp environment

[![Travis](https://img.shields.io/travis/spacedoc/gulp-to-go.svg?maxAge=2592000)](https://travis-ci.org/spacedoc/gulp-to-go) [![npm](https://img.shields.io/npm/v/gulp-to-go.svg?maxAge=2592000)](https://www.npmjs.com/package/gulp-to-go)

Sometimes you want to use Gulp's handy streaming, tasking, asyncing features without the usual `gulp` command and `Gulpfile.js`. And *maybe* you want that build system to be configurable. gulp-to-go has your back.

## Installation

```bash
npm install gulp-to-go
```

## Usage

[Gulp 4.0](https://github.com/gulpjs/gulp/tree/4.0)'s API is used.

```js
import GulpToGo from 'gulp-to-go';

// Build a Gulpfile in this callback, defining public tasks with `gulp.task()`
// You can also specify custom options to be passed to the tasks at runtime
const gulp = GulpToGo((gulp, options) => {
  gulp.task('build', gulp.series(copy));

  gulp.task('default', gulp.parallel('build', watch));

  function copy() {
    gulp.src(options.src).pipe(gulp.dest(options.dist));
  }

  function watch() {
    gulp.watch(options.src, copy);
  }
});

// Now you can run public tasks and monitor them
gulp('build', {
  src: 'src/**/*',
  dist: 'dist',
}).then(() => {
  console.log('build task done!');
}).then(err => {
  console.log('build task done goofed!');
});
```

## API

### GulpToGo(fn)

Create a function that bootstraps a Gulp build process.

- **fn** (Function): function to set up build process. Accepts these parameters:
  - **gulp** (Object): instance of Gulp. Use it to access `src`, `dest`, `watch`, and so on.
  - **options** (Object): options passed by the bootstrapping function.

Returns a function that accepts these parameters:

- **task** (String): *Optional.* task to run. Must be a task defined with `gulp.task` in the bootstrap function.
- **options** (Object): *Optional.* Options to pass to the bootstrap function.

By omitting the task name from the function call, the `default` task will be run. You can also pass in an options object only, which will cause the `default` task to be run as well.

That function returns a Promise which resolves when the given task has been run, or rejects if there's an error in the process. Note that if the task being called includes a step that runs indefinitely, such as a `watch()` function, the Promise will never resolve, unless an error is encountered, in which case it will reject.

## Local Development

```bash
git clone https://github.com/spacedoc/gulp-to-go
cd gulp-to-go
npm install
npm test
```

## License

MIT &copy; [Geoff Kimball](http://geoffkimball.com)
