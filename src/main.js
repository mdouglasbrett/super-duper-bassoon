// @flow
import fs from "fs";
import contentParser from "./lib/utils";

const dataObjectBuilder = async (config: Config): Promise<any> => {
  const { pagesPath, postsPath, meta } = config;
  const pages = await Promise.all(contentParser(fs.readdirSync(pagesPath), pagesPath)).then(
    console.log("All pages parsed")
  );
  const posts = await Promise.all(contentParser(fs.readdirSync(postsPath), postsPath))
    .then((posts: any) => posts.sort((a, b) => b.date - a.date))
    .then(console.log("All posts parsed"));
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
