'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const GulpToGo = require('.');

chai.use(chaiAsPromised);
const expect = require('chai').expect;

describe('GulpToGo()', () => {
  it('creates a function', () => {
    const fn = () => {};
    expect(GulpToGo(fn)).to.be.a('function');
  });
});

describe('Gulp function', () => {
  it('returns a Promise', () => {
    const fn = gulp => {
      gulp.task('default', done => done());
    }
    expect(GulpToGo(fn)('default')).to.be.an.instanceOf(Promise);
  });

  it('passes a Gulp instance as the first parameter', () => {
    const fn = gulp => {
      gulp.task('default', done => done());
      expect(gulp).to.contain.all.keys(['task', 'watch']);
    }
    return GulpToGo(fn)('default');
  });

  it('passes an options object as the second parameter', () => {
    const fn = (gulp, opts) => {
      gulp.task('default', done => done());
      expect(opts).to.eql({ kittens: true });
    }
    return GulpToGo(fn)('default', { kittens: true });
  });

  it('defaults to the "default" task', () => {
    const fn = gulp => {
      gulp.task('default', done => done());
    }
    return GulpToGo(fn)();
  });

  it('allows only options to be passed', () => {
    const fn = (gulp, opts) => {
      gulp.task('default', done => done());
      expect(opts).to.eql({ kittens: true });
    }
    return GulpToGo(fn)({ kittens: true });
  });

  it('rejects if a task encounters an error', () => {
    const fn = gulp => {
      gulp.task('default', done => {
        throw new Error('lol');
      });
    }
    return expect(GulpToGo(fn)('default')).to.eventually.be.rejectedWith(Error);
  });
});
