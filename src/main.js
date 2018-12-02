// @flow
import fs from 'fs';
import contentParser from './lib/utils';
import type Config from '../flow-typed/super-duper-bassoon';

const dataObjectBuilder = async (config: Config): Promise<any> => {
  const { pagesPath, postsPath, meta } = config;
  // TODO: isn't the point of this that everything is async? In that case we should be using readdir...
  const pages = await Promise.all(
    contentParser(fs.readdirSync(pagesPath), pagesPath)
  );
  const posts = await Promise.all(
    contentParser(fs.readdirSync(postsPath), postsPath)
  ).then((returnedPosts: any) => returnedPosts.sort((a, b) => b.date - a.date));
  // const tags = deDupeList(posts.map(p => p.tags).reduce((a, b) => a.concat(b)));
  return new Promise((resolve, reject) => {
    resolve({
      pages,
      posts,
      meta
    });
    reject(new Error('Something went wrong :('));
  });
};

export default dataObjectBuilder;
