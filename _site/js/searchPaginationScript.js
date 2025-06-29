document.addEventListener("DOMContentLoaded", function () {
  const postsPerPage = 3;
  const posts = Array.from(document.querySelectorAll(".blog-entry"));
  const paginationContainer = document.getElementById("pagination-controls");
  const searchInput = document.getElementById("search-input");
  searchInput.value = "";

  let filteredPosts = posts;
  let currentPage = 1;

  function getMatchScore(post, query) {
    const q = query.toLowerCase();

    const title =
      post.querySelector(".heading")?.textContent.toLowerCase() || "";
    const description =
      post.querySelector(".description")?.textContent.toLowerCase() || "";
    const content =
      post.querySelector(".content")?.textContent.toLowerCase() || "";

    if (title.includes(q)) return 3;
    if (description.includes(q)) return 2;
    if (content.includes(q)) return 1;

    return 0;
  }

  function filterPosts(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      filteredPosts = posts;
    } else {
      filteredPosts = posts
        .map((post) => {
          const score = getMatchScore(post, query);
          return { post, score };
        })
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ post }) => post);
    }
  }

  function showPage(page) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const noResultsEl = document.getElementById("no-results");

    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;

    // Hide all posts
    posts.forEach((post) => (post.style.display = "none"));

    if (filteredPosts.length === 0) {
      if (noResultsEl) noResultsEl.style.display = "block";
      paginationContainer.innerHTML = ""; // Clear pagination if nothing to show
      return;
    } else {
      if (noResultsEl) noResultsEl.style.display = "none";
    }

    // Show current page's posts
    filteredPosts.forEach((post, index) => {
      if (index >= (page - 1) * postsPerPage && index < page * postsPerPage) {
        post.style.display = "block";
      }
    });

    renderPagination(totalPages, currentPage);

    const blogPostsTop = document.getElementById("blog-posts").offsetTop;
    window.scrollTo({ top: blogPostsTop, behavior: "smooth" });
  }

  function renderPagination(totalPages, activePage) {
    paginationContainer.innerHTML = "";

    if (totalPages <= 1) return;

    const prevBtn = document.createElement("button");
    prevBtn.className = "btn mx-1 btn-outline-secondary";
    prevBtn.disabled = activePage === 1;
    prevBtn.title = "Previous";
    prevBtn.innerHTML = `<i class='fa-solid fa-angle-left'></i>`;
    prevBtn.addEventListener("click", () => showPage(currentPage - 1));
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className =
        "btn mx-1 " +
        (i === activePage ? "btn-primary" : "btn-outline-secondary");
      btn.addEventListener("click", () => showPage(i));
      paginationContainer.appendChild(btn);
    }

    const nextBtn = document.createElement("button");
    nextBtn.className = "btn mx-1 btn-outline-secondary";
    nextBtn.disabled = activePage === totalPages;
    nextBtn.title = "Next";
    nextBtn.innerHTML = `<i class='fa-solid fa-angle-right'></i>`;
    nextBtn.addEventListener("click", () => showPage(currentPage + 1));
    paginationContainer.appendChild(nextBtn);
  }

  if (!searchInput) {
    console.error("Search input with id 'search-input' not found!");
    return;
  }

  searchInput.addEventListener("input", (e) => {
    filterPosts(e.target.value);
    showPage(1);
  });

  // Initialize
  filterPosts("");
  showPage(1);
});
