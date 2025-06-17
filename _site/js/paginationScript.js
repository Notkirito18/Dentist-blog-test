document.addEventListener("DOMContentLoaded", function () {
  const postsPerPage = 3;
  const posts = Array.from(document.querySelectorAll(".blog-entry"));
  const paginationContainer = document.getElementById("pagination-controls");
  const searchInput = document.getElementById("search-input");

  let filteredPosts = posts; // filtered list based on search
  let currentPage = 1;

  function filterPosts(query) {
    query = query.trim().toLowerCase();
    if (!query) {
      filteredPosts = posts;
    } else {
      filteredPosts = posts.filter((post) => {
        const text = post.textContent.toLowerCase();
        return text.includes(query);
      });
    }
  }

  function showPage(page) {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;
    currentPage = page;

    // Hide all posts first
    posts.forEach((post) => (post.style.display = "none"));

    // Show only filtered posts for current page
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

    if (totalPages <= 1) return; // no pagination if only one page

    // Previous button
    const prevBtn = document.createElement("button");
    prevBtn.className = "btn mx-1 btn-outline-secondary";
    prevBtn.disabled = activePage === 1;
    prevBtn.title = "Previous";
    prevBtn.innerHTML = `<i class='fa-solid fa-angle-left'></i>`;
    prevBtn.addEventListener("click", () => showPage(currentPage - 1));
    paginationContainer.appendChild(prevBtn);

    // Page number buttons
    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className =
        "btn mx-1 " +
        (i === activePage ? "btn-primary" : "btn-outline-secondary");
      btn.addEventListener("click", () => showPage(i));
      paginationContainer.appendChild(btn);
    }

    // Next button
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
