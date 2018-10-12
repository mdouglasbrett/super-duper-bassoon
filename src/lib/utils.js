// @flow
import fs from "fs";
import path from "path";
import frontMatter from "front-matter";
import marked from "marked";
import moment from "moment";

export const createArticleSummary = (article: string): string => {
  const SUMMARIZE_MARKER = /(<!-+[sum+arize]{9}-+>)/;
  if (SUMMARIZE_MARKER.exec(article)) {
    // $FlowFixMe
    return article.split(SUMMARIZE_MARKER.exec(article)[1])[0];
  }
  return '';
};

export const createDirectoryPath = (dateString: string): string => {
  const DIR_FORMAT = /(\d{4})-(\d{1,2})-(\d{1,2})(.*)/;
  const dir = DIR_FORMAT.exec(dateString);
  if (dir) {
    return `dist/${dir[1]}/${dir[2]}/${dir[3]}`;
  }
  return "";
};

export const createPostUrl = (pathName: string, fileName: string): string => {
  const newPath = pathName.replace("dist/", "/");
  return `${newPath}/${fileName}`;
};

export const transformStringToDate = (dateString: string): Date => {
  return new Date(dateString);
};

export const wrapDate = (date: Date): string => {
  return moment(date).format("MMM Do YYYY");
};

export const transformDateToIsoString = (date: Date): string => {
  return date.toISOString();
};

export const deDupeList = (arr: Array<any>): Set<any> => {
  const deDupe = new Set();
  arr.forEach(i => {
    deDupe.add(i);
  });
  return deDupe;
};

// TODO: don't think I need this...
export const renameFile = (filename: string): string => {
  return `${path.basename(filename, ".md")}.html`;
};

export const fileContent = (file: any): { meta: any, main: string } => {
  const { attributes, body } = frontMatter(file);
  return {
    meta: attributes,
    main: marked(body)
  };
};

// TODO: Use this promise in conjunction with a generator/run function in the contentParser?
// See 'The Miracle Of Generators' by Bodil Stokke
export const promisifiedFileReader = (filePath: string, options: any): Promise<any> => {
  return new Promise((resolve, reject) =>
    // $FlowFixMe
    fs.readFile(filePath, options, (err, contents) => (err ? reject(err) : resolve(contents)))
  );
};
