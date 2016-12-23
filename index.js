'use strict';

const asyncDone = require('async-done');
const Gulp = require('gulp').Gulp;

/**
 * Create a function that bootstraps a Gulp build process.
 * @param {GulpDefinitionFunction} fn - Function to define the build process.
 * @returns {GulpCallerFunction} Function to call a task within the defined build process.
 */
module.exports = function GulpToGo(fn) {
  /**
   * Run a task defined by a gulp-to-go build process.
   * @callback GulpCallerFunction
   * @param {String} task - Task to run.
   * @param {Object} [options] - Options to pass to build environment.
   * @returns {Promise} Promise which resolves when task is finished without errors.
   */
  return (task, options) => new Promise((resolve, reject) => {
    if (typeof task === 'object') {
      options = task;
      task = 'default';
    }
    else {
      task = task || 'default';
      options = options || {};
    }

    const gulp = new Gulp();

    /**
     * Define a Gulp build process with a public API of tasks.
     * @callback GulpDefinitionFunction
     * @param {Object} gulp - Gulp instance.
     * @param {Object} tasks - Object to add public tasks to.
     * @param {Object} options - Options passed by calling function.
     */
    fn(gulp, options);

    const taskFn = gulp.task(task);

    if (taskFn) {
      // asyncDone monitors a Gulp task in any format and signals when it's done
      asyncDone(taskFn, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    }
    else {
      reject(new Error(`gulp-to-go: no public task named ${task}`));
    }
  });
}
