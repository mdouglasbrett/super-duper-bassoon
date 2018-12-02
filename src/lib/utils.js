// @flow
import fs from 'fs';
import path from 'path';
import frontMatter from 'front-matter';
import marked from 'marked';
import moment from 'moment';

// Not sure I am going to use this in the package as it is currently set up...
// This function writes files, and I think the package is going to return a
// Promise that has to be resolved the other side.
// TODO: annotate this function
// const archiveBuilder = (archiveData: any, maxPostsPerPage: number = 5): void => {
//   if (archiveData.posts.length) {
//     let posts = [];
//     let postCount = 0;
//     let pageCount = 0;
//     archiveData.posts.forEach((post, index) => {
//       posts.push(post);
//       postCount += 1;
//       if (postCount === maxPostsPerPage || index === archiveData.posts.length - 1) {
//         const archivePageData = {
//           ...archiveData,
//           posts,
//           newerPosts:
//             pageCount !== 0 ? `${rootName}${pageCount - 1 === 0
//             ? "" : pageCount - 1}.html`
//             : null,
//           olderPosts:
//             (pageCount + 1) * maxPostsPerPage < data.posts.length
//               ? `${rootName}${pageCount + 1}.html`
//               : null,
//           title: `Posts, page no.${pageCount + 1}`
//         };
//         fs.writeFileSync(
//           `dist/${rootName}${pageCount === 0 ? "" : pageCount}.html`,
//           template("archive", archivePageData)
//         );
//         postCount = 0;
//         posts = [];
//         pageCount += 1;
//       }
//     });
//   }
// };

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
  return '';
};

export const createPostUrl = (pathName: string, fileName: string): string => {
  const newPath = pathName.replace('dist/', '/');
  return `${newPath}/${fileName}`;
};

export const transformStringToDate = (dateString: string): Date => new Date(dateString);

export const wrapDate = (date: Date): string => moment(date).format('MMM Do YYYY');

export const transformDateToIsoString = (date: Date): string => date.toISOString();

export const deDupeList = (arr: Array<any>): Set<any> => {
  const deDupe = new Set();
  arr.forEach((i) => deDupe.add(i));
  return deDupe;
};

// TODO: don't think I need this...
export const renameFile = (filename: string): string => `${path.basename(filename, '.md')}.html`;

export const fileContent = (file: any): { meta: any, main: string } => {
  const { attributes, body } = frontMatter(file);
  return {
    meta: attributes,
    main: marked(body)
  };
};

// TODO: Use this promise in conjunction with a generator/run function in the contentParser?
// See 'The Miracle Of Generators' by Bodil Stokke
export const promisifiedFileReader = (filePath: string, options: any): Promise<any> =>
  new Promise((resolve, reject) =>
    fs.readFile(filePath, options, (err, contents) => (err ? reject(err) : resolve(contents)))
  );

const contentParser = (arr: Array<string>, fileType: string): Array<Promise<any>> =>
  arr.map((i) =>
    promisifiedFileReader(path.join(fileType, i), 'utf8').then((content) => {
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

export default contentParser;
