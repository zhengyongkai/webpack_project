const webpack = require('webpack');
class RemoveCommentPlugin {
  opts = null;
  constructor(opts) {
    this.opts = opts;
  }
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'RemoveCommentPlugin',
      function (compilation) {
        compilation.hooks.buildModule.tap(
          {
            name: 'RemoveCommentPlugin',
          },
          (compilationAssets, callback) => {
            console.time();
          }
        );
        compilation.hooks.afterSeal.tap(
          {
            name: 'RemoveCommentPlugin',
          },
          (compilationAssets, callback) => {
            console.timeEnd();
          }
        );
      }
    );
  }
}

module.exports = RemoveCommentPlugin;
