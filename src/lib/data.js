// @flow
"use strict";

const fs = require("fs");
const path = require("path");
const env = require("node-env-file");

const {
  fileContent,
  renameFile,
  transformStringToDate,
  wrapDate,
  createDirectoryPath,
  transformDateToIsoString,
  // deDupeList,
  createPostUrl,
  promisifiedFileReader
} = require("./utils");

env(`${__dirname}/.env`);
const PAGE_DIR = "src/content/pages/";
const POST_DIR = "src/content/posts/";
const author = process.env.AUTHOR;
const title = process.env.TITLE;
const url = process.env.URL;
const email = process.env.EMAIL;
const cacheRef = Date.now();

/**
 * @param  {Array} arr - Array of page and post names
 * @param  {String} fileType - Directory path
 * @return {Array} Array of (promise) objects based on file contents
 */
const contentParser = (arr, fileType) =>
  arr.map(i =>
    promisifiedFileReader(path.join(fileType, i), "utf8").then(content => {
      const { meta, main } = fileContent(content);
      const { title, tags, draftDate } = meta;
      const fileName = renameFile(i);
      let date;
      let formattedDate;
      let directoryPath;
      let postUrl;
      if (draftDate) {
        date = transformStringToDate(draftDate);
        formattedDate = wrapDate(date);
        directoryPath = createDirectoryPath(transformDateToIsoString(date));
        postUrl = createPostUrl(directoryPath, fileName);
      }
      console.log(`Parsed: ${fileName}`);
      return {
        title,
        tags,
        main,
        fileName,
        formattedDate,
        draftDate,
        date,
        directoryPath,
        postUrl
      };
    })
  );

/**
 *
 * @param {string} pageDirectory
 * @param {string} postDirectory
 * @returns {Promise}
 */
const dataObjectBuilder = async (pageDirectory = "", postDirectory = "") => {
  const pages = await Promise.all(contentParser(fs.readdirSync(pageDirectory), pageDirectory)).then(
    console.log("All pages parsed")
  );
  const posts = await Promise.all(contentParser(fs.readdirSync(postDirectory), postDirectory))
    .then(posts => posts.sort((a, b) => b.date - a.date))
    .then(console.log("All posts parsed"));
  // const tags = deDupeList(posts.map(p => p.tags).reduce((a, b) => a.concat(b)));
  return new Promise((resolve, reject) => {
    resolve({
      pages,
      posts,
      cacheRef,
      config: {
        author,
        title,
        url,
        email
      }
    });
    reject();
  });
};

dataObjectBuilder(PAGE_DIR, POST_DIR).then(result =>
  promisifiedFileWriter(JSON.stringify({ ...result }), "json")
    .then(console.log("Site JSON written"))
    .catch(err => console.log(err))
    .catch(err => console.log(err))
);
