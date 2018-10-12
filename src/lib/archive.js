// @flow

import fs from "fs";
import data from "./site.json";
import template from "./templates";

const rootName = "posts";

/*
 * TODO: This is disgusting! Need to apply a bit more thought to this
 * function
 */

const archiveBuilder = (archiveData, maxPostsPerPage = 5) => {
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
