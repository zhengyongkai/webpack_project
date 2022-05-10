const { tplReplace, tplCompiler } = require("./compiler");
const { getOptions } = require("loader-utils");

function tplLoader(source) {
  const { log } = getOptions(this);

  const _log = log
    ? `console.log('compiled the file which is from ${this.resourcePath}')`
    : "";

  const content = tplCompiler(source);
  // console.log(content);
  return `
    export default {
      template: '${content}'
    }
  `;
  // this.callback(`export default { template: '${content}'} `);
}
module.exports = tplLoader;
