module.exports = {
  // All files in this folder get this layout by default:
  layout: "layouts/blog-post.njk",

  // And this permalink (you can customize the slug logic here):
  permalink: (data) => {
    // data.page.fileSlug is the filename without extension
    return `/posts/${data.page.fileSlug}/`;
  },
};
