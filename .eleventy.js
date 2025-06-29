// .eleventy.js

const { DateTime } = require("luxon");

module.exports = function (eleventyConfig) {
  // 1. Copy over your asset folders exactly as‑is:
  eleventyConfig.addPassthroughCopy({ "src/css": "css" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/admin": "admin" });
  eleventyConfig.addPassthroughCopy("src/favicon.png");

  eleventyConfig.addFilter("date", (value, format = "yyyy LLL dd") => {
    return DateTime.fromJSDate(new Date(value)).toFormat(format);
  });

  // posts collection
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/posts/*.md");
  });

  //  posts collection sorted by date
  eleventyConfig.addCollection("latestPosts", function (collectionApi) {
    let posts = collectionApi.getFilteredByGlob("./src/posts/*.md");
    posts.sort((a, b) => b.date - a.date);
    return posts.slice(0, 3);
  });

  // services collection
  eleventyConfig.addCollection("services", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/services_data/*.md");
  });

  // homeServices collection
  eleventyConfig.addCollection("homeServices", function (collectionApi) {
    let services = collectionApi.getFilteredByGlob("./src/services_data/*.md");
    let servicesSliced = services.slice(0, 4);
    return servicesSliced;
  });

  //detists collection
  eleventyConfig.addCollection("dentists", function (collectionApi) {
    return collectionApi.getFilteredByGlob("./src/dentists_data/*.md");
  });

  // homeDentists collection
  eleventyConfig.addCollection("homeDentists", function (collectionApi) {
    let dentists = collectionApi.getFilteredByGlob("./src/dentists_data/*.md");
    let dentistsSliced = dentists.slice(0, 4);
    return dentistsSliced;
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
