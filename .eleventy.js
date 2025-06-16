// .eleventy.js

const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // 1. Copy over your asset folders exactly as‑is:
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });

  eleventyConfig.addFilter("date", (value, format = "yyyy LLL dd") => {
    return DateTime.fromJSDate(new Date(value)).toFormat(format);
  });

  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/posts/*.md");
  });

  //  Add a collection for the latest posts:
  eleventyConfig.addCollection("latestPosts", function (collectionApi) {
    let posts = collectionApi.getFilteredByGlob("./src/posts/*.md");
    posts.sort((a, b) => b.date - a.date);
    return posts.slice(0, 3);
  });

  // Copy the CSS into /css in your built site
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fortawesome/fontawesome-free/css/all.min.css":
      "css/all.min.css",
  });
  // Copy the webfonts into /webfonts in your built site
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fortawesome/fontawesome-free/webfonts": "webfonts",
  });

  // 2. Tell Eleventy where to find source and where to write output:
  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    // 3. Set template engines:
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
