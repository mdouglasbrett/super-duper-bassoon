// @flow
import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';
import moment from 'moment';

const DIR_FORMAT = /(\d{4})-(\d{1,2})-(\d{1,2})(.*)/;
const SUMMARIZE_MARKER = /(<!-+[sum+arize]{9}-+>)/;

const createArticleSummary = (article: string): string => {
  if (SUMMARIZE_MARKER.exec(article)) {
    return article.split(SUMMARIZE_MARKER.exec(article)[1])[0];
  }
  return '';
};

const createDirectoryPath = (dateString: string): string => {
  const dir = DIR_FORMAT.exec(dateString);
  if (dir) {
    return `dist/${dir[1]}/${dir[2]}/${dir[3]}`;
  }
  return '';
};

const createPostUrl = (pathName: string, fileName: string): string => {
  const newPath = pathName.replace('dist/', '/');
  return `${newPath}/${fileName}`;
};

const transformStringToDate = (dateString: string): Date =>
  new Date(dateString);

const wrapDate = (date: Date): string => moment(date).format('MMM Do YYYY');

const transformDateToIsoString = (date: Date): string => date.toISOString();

// const deDupeList = (arr: Array<any>): Set<any> => {
//   const deDupe = new Set();
//   arr.forEach((i) => deDupe.add(i));
//   return deDupe;
// };

// TODO: don't think I need this...
const renameFile = (filename: string): string =>
  `${path.basename(filename, '.md')}.html`;

const fileContent = (file: any): { meta: any, main: string } => {
  const { attributes, body } = frontMatter(file);
  return {
    meta: attributes,
    main: marked(body)
  };
};

// TODO: Use this promise in conjunction with a generator/run function in the contentParser?
// See 'The Miracle Of Generators' by Bodil Stokke
const promisifiedFileReader = (
  filePath: string,
  ...options: any
): Promise<any> =>
  new Promise((resolve, reject) =>
    fs.readFile(
      filePath,
      ...options,
      (err, contents) => (err ? reject(err) : resolve(contents))
    )
  );

const contentParser = (
  arr: Array<string>,
  fileType: string
): Array<Promise<any>> =>
  arr.map((i) =>
    promisifiedFileReader(path.join(fileType, i), 'utf8').then((content) => {
      const readContent = fileContent(content);
      const { meta, main } = readContent;
      const { title, tags, draftDate } = meta;
      const summary = createArticleSummary(readContent);
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
      return {
        title,
        tags,
        main,
        fileName,
        formattedDate,
        draftDate,
        date,
        directoryPath,
        postUrl,
        summary
      };
    })
  );

export default contentParser;
