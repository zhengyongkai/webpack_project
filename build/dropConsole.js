const { tplReplace, tplCompiler } = require('./compiler');
const { getOptions } = require('loader-utils');

function tplLoader(source) {
  console.log(source);
  const { filename } = getOptions(this);

  console.log(filename);

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
