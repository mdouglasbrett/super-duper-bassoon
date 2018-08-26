// @flow

"use strict";

import fs from "fs";
import path from "path";
import frontMatter from "front-matter";
import marked from "marked";
import moment from "moment";

// String manipulation functions

/**
 * @param {string} article
 * @returns {*}
 */
// function createArticleSummary(article = '') {
//   const SUMMARIZE_MARKER = /(<!-+[sum+arize]{9}-+>)/;
//   if (SUMMARIZE_MARKER.exec(article)) {
//     return article.split(SUMMARIZE_MARKER.exec(article)[1])[0];
//   }
//   return '';
// }

/**
 * @param {string} dateString
 * @returns {string}
 */
const createDirectoryPath = (dateString = "") => {
  const DIR_FORMAT = /(\d{4})-(\d{1,2})-(\d{1,2})(.*)/;
  const dir = DIR_FORMAT.exec(dateString);
  if (dir) {
    return `dist/${dir[1]}/${dir[2]}/${dir[3]}`;
  }
  return "";
};

function createPostUrl(pathName = "", fileName = "") {
  const newPath = pathName.replace("dist/", "/");
  return `${newPath}/${fileName}`;
}
/**
 * @param {string} dateString
 * @returns {Date}
 */
function transformStringToDate(dateString = "") {
  return new Date(dateString);
}

/**
 * @param {Date} date
 * @returns {string}
 */
function wrapDate(date) {
  return moment(date).format("MMM Do YYYY");
}

/**
 * @param {Date} date
 * @returns {string}
 */
function transformDateToIsoString(date) {
  return date.toISOString();
}

// Array functions

/**
 * @param  {Array} arr
 * @return {Set}  Set of unique items
 */
function deDupeList(arr = []) {
  const deDupe = new Set();
  arr.forEach(i => {
    deDupe.add(i);
  });
  return deDupe;
}

// File manipulation (reading, writing and moving)

/**
 * @param {string} filename
 * @returns {string}
 */
function renameFile(filename = "") {
  return `${path.basename(filename, ".md")}.html`;
}

/**
 * @param {Object} file
 * @returns {Object}
 */
function fileContent(file = {}) {
  const { attributes, body } = frontMatter(file);
  return {
    meta: attributes,
    main: marked(body)
  };
}

/*
 * TODO: Use this promise in conjunction with a generator/run function in the contentParser?
 * See 'The Miracle Of Generators' by Bodil Stokke
 * @param {string} filePath
 * @param {Object} options
 * @returns {*}
 */
function promisifiedFileReader(filePath, options) {
  return new Promise((resolve, reject) =>
    fs.readFile(filePath, options, (err, contents) => (err ? reject(err) : resolve(contents)))
  );
}

export default {
  // createArticleSummary,
  // deDupeList,
  createDirectoryPath,
  createPostUrl,
  renameFile,
  fileContent,
  wrapDate,
  transformStringToDate,
  transformDateToIsoString,
  promisifiedFileReader
};
