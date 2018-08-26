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

const createDirectoryPath = (dateString: string): string => {
  const DIR_FORMAT = /(\d{4})-(\d{1,2})-(\d{1,2})(.*)/;
  const dir = DIR_FORMAT.exec(dateString);
  if (dir) {
    return `dist/${dir[1]}/${dir[2]}/${dir[3]}`;
  }
  return "";
};

const createPostUrl = (pathName: string, fileName: string): string => {
  const newPath = pathName.replace("dist/", "/");
  return `${newPath}/${fileName}`;
};

const transformStringToDate = (dateString: string): Date => {
  return new Date(dateString);
};

const wrapDate = (date: Date): string => {
  return moment(date).format("MMM Do YYYY");
};

/**
 * @param {Date} date
 * @returns {string}
 */
const transformDateToIsoString = (date: Date): string => {
  return date.toISOString();
};

// Array functions

const deDupeList = (arr: Array<any>): Set<any> => {
  const deDupe = new Set();
  arr.forEach(i => {
    deDupe.add(i);
  });
  return deDupe;
};

// File manipulation (reading, writing and moving)

/**
 * TODO: don't think I need this...
 * @param {string} filename
 * @returns {string}
 */
// function renameFile(filename = "") {
//   return `${path.basename(filename, ".md")}.html`;
// }

// TODO: WIP types here
const fileContent = (file: any = {}): { meta: any, main: string } => {
  const { attributes, body } = frontMatter(file);
  return {
    meta: attributes,
    main: marked(body)
  };
};

/*
 * TODO: Use this promise in conjunction with a generator/run function in the contentParser?
 * See 'The Miracle Of Generators' by Bodil Stokke
 * @param {string} filePath
 * @param {Object} options
 * @returns {*}
 */
function promisifiedFileReader(filePath: string, options: any): Promise<any> {
  return new Promise((resolve, reject) =>
    // $FlowFixMe
    fs.readFile(filePath, options, (err, contents) => (err ? reject(err) : resolve(contents)))
  );
}

export default {
  // createArticleSummary,
  // renameFile,
  deDupeList,
  createDirectoryPath,
  createPostUrl,
  fileContent,
  wrapDate,
  transformStringToDate,
  transformDateToIsoString,
  promisifiedFileReader
};
