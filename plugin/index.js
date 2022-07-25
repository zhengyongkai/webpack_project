class RemoveCommentPlugin {
  opts = null;
  constructor(opts) {
    this.opts = opts;
  }
  apply(compiler) {
    compiler.hooks.emit.tap('done', function (compilation) {
      console.log('finish');
    });
  }
}

module.exports = RemoveCommentPlugin;
