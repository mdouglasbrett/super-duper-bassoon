// @flow

import fs from "fs";
import data from "./site.json";
import template from "./templates";

const rootName = "posts";

// Not sure I am going to use this in the package as it is currently set up...
// This function writes files, and I think the package is going to return a
// Promise that has to be resolved the other side.
// TODO: annotate this function
const archiveBuilder = (archiveData: any, maxPostsPerPage: number = 5): void => {
  if (archiveData.posts.length) {
    let posts = [];
    let postCount = 0;
    let pageCount = 0;
    archiveData.posts.forEach((post, index) => {
      posts.push(post);
      postCount += 1;
      if (postCount === maxPostsPerPage || index === archiveData.posts.length - 1) {
        const archivePageData = {
          ...archiveData,
          posts,
          newerPosts:
            pageCount !== 0 ? `${rootName}${pageCount - 1 === 0 ? "" : pageCount - 1}.html` : null,
          olderPosts:
            (pageCount + 1) * maxPostsPerPage < data.posts.length
              ? `${rootName}${pageCount + 1}.html`
              : null,
          title: `Posts, page no.${pageCount + 1}`
        };
        fs.writeFileSync(
          `dist/${rootName}${pageCount === 0 ? "" : pageCount}.html`,
          template("archive", archivePageData)
        );
        postCount = 0;
        posts = [];
        pageCount += 1;
      }
    });
  }
};

archiveBuilder(data);
