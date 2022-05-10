// loaders/tpl-loader/compiler/index.js
const { HTML_TEMPLATE_TAG, SCRIPT_TEMPLATE_TAG } = require("./const");

/**
 * 模板中插值替换 <div>{{data}}</div> replaceMap = { data: 1 }
 * 则 <div>{{data}}</div> => <div>1</div>
 * @param {*} template 模板
 * @param {*} replaceMap 数据源
 * @returns
 */
function tplReplace(template, replaceMap) {
  return template.replace(/\{\{(.*?)\}\}/g, (node, key) => {
    return replaceMap[key.trim()];
  });
}

/**
 * 生成正则表达式
 * @param {*} tag
 * @returns
 */
function generateTagReg(tag) {
  return new RegExp(`<${tag}>([\\s\\S]*?)<\/${tag}>`);
}

/**
 * 从模板中根据tag取出内容 例如 getTemplateFromSource(source, 'template') // 取出<template> .... </template> 中的内容
 * @param {*} source
 * @param {*} templateTag 例如 `template`
 * @returns string
 */
function getTemplateFromSource(source, templateTag) {
  const res = generateTagReg(templateTag).exec(source);
  return res && res.length > 0 ? res[1] : "";
}

/**
 * 拿到模板中的`template`标签的内容
 * @param {*} source
 * @returns
 */
function getHTMLTemplateFromSource(source) {
  return getTemplateFromSource(source, HTML_TEMPLATE_TAG);
}

/**
 * 拿到模板中的`script`标签的内容
 * @param {*} source
 * @returns
 */
function getScriptTemplateFromSource(source) {
  return getTemplateFromSource(source, SCRIPT_TEMPLATE_TAG);
}

/**
 * 解析script内容拿到数据
 * @param {*} scriptTemplate
 * @returns
 */
function getDataMapFropmScriptTemplate(scriptTemplate) {
  const fnStr = scriptTemplate.replace("export default", "");
  return eval(fnStr)();
}

/**
 * 根据模版，进行编译
 * @param {*} source
 * @returns string
 */
function tplCompiler(source) {
  const htmlTemplate = getHTMLTemplateFromSource(source);
  const scriptTemplate = getScriptTemplateFromSource(source);

  const dataMap = getDataMapFropmScriptTemplate(scriptTemplate);
  return tplReplace(htmlTemplate, dataMap).replace(/[\n\t]+/g, "");
}

module.exports = {
  tplReplace,
  tplCompiler,
};
