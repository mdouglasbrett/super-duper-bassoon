// @flow
import fs from 'fs';
import contentParser from './lib/utils';

// TODO: obvs
type Config = any;

const dataObjectBuilder = async (config: Config): Promise<any> => {
  const { pagesPath, postsPath, meta } = config;
  const pages = await Promise.all(contentParser(fs.readdirSync(pagesPath), pagesPath));
  const posts = await Promise.all(contentParser(fs.readdirSync(postsPath), postsPath)).then(
    (returnedPosts: any) => returnedPosts.sort((a, b) => b.date - a.date)
  );
  // const tags = deDupeList(posts.map(p => p.tags).reduce((a, b) => a.concat(b)));
  return new Promise((resolve, reject) => {
    resolve({
      pages,
      posts,
      meta
    });
    reject();
  });
};

export default dataObjectBuilder;
