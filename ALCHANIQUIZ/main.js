const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

let globalData = [];

function getBookmarks() {
    return JSON.parse(localStorage.getItem('bookmarkedShows')) || [];
}

function saveBookmarks(bookmarks) {
    localStorage.setItem('bookmarkedShows', JSON.stringify(bookmarks));
}

function renderBookmarkedShows(allData, query = "") {
    const bookmarkedContainer = document.querySelector('.bookmarkedShows');
    if (!bookmarkedContainer) return;
    
    const template = document.getElementById('showTemplate');
    const bookmarks = getBookmarks();
    
    bookmarkedContainer.innerHTML = '';
    
    const bookmarkedData = allData.filter(show => 
        bookmarks.includes(show.title) && 
        show.title.toLowerCase().includes(query.toLowerCase())
    );
    
    bookmarkedData.forEach(show => {
        const showClone = template.content.cloneNode(true);
        
        showClone.querySelector('#showImage').src = show.thumbnail.regular.small;
        showClone.querySelector('#year').textContent = show.year;
        showClone.querySelector('#category').textContent = show.category;
        showClone.querySelector('#ageRating').textContent = show.rating;
        showClone.querySelector('#title').textContent = show.title;
        
        const bookmarkImg = showClone.querySelector('#bookmarkIMG');
        bookmarkImg.src = "./assets/bookmarkFull.svg";
        
        const bookmarkBtn = bookmarkImg.closest('button') || bookmarkImg;
        bookmarkBtn.addEventListener('click', () => {
            toggleBookmark(show.title);
        });
        
        bookmarkedContainer.appendChild(showClone);
    });
}

function toggleBookmark(showTitle) {
    let bookmarks = getBookmarks();
    
    if (bookmarks.includes(showTitle)) {
        bookmarks = bookmarks.filter(title => title !== showTitle);
    } else {
        bookmarks.push(showTitle);
    }
    
    saveBookmarks(bookmarks);
    
    const query = searchInput ? searchInput.value : "";
    renderTVShows(globalData, query);
    renderBookmarkedShows(globalData, query);
}

function renderTVShows(data, query = "") {
    const container = document.querySelector('.shows');
    const template = document.getElementById('showTemplate');
    const bookmarks = getBookmarks();
  
    if (!container) return;
    
    container.innerHTML = '';
    
    const tvShows = data.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
    );
  
    tvShows.forEach(show => {
      const showClone = template.content.cloneNode(true);
  
      showClone.querySelector('#showImage').src = show.thumbnail.regular.small;
      showClone.querySelector('#year').textContent = show.year;
      showClone.querySelector('#category').textContent = show.category;
      showClone.querySelector('#ageRating').textContent = show.rating;
      showClone.querySelector('#title').textContent = show.title;

      const bookmarkImg = showClone.querySelector('#bookmarkIMG');
      
      const isBookmarked = bookmarks.includes(show.title);
      bookmarkImg.src = isBookmarked ? "./assets/bookmarkFull.svg" : "./assets/bookmarkEmpty.svg"; 

      const bookmarkBtn = bookmarkImg.closest('button') || bookmarkImg;
      bookmarkBtn.addEventListener('click', () => {
          toggleBookmark(show.title);
      });
  
      container.appendChild(showClone);
    });
}

function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        renderTVShows(globalData, query);
        renderBookmarkedShows(globalData, query);
    });

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    }
}
  
async function loadData() {
    const url = "https://raw.githubusercontent.com/lomsadze123/movie-api/refs/heads/main/data.json";
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      globalData = await response.json();
      
      renderTVShows(globalData);
      renderBookmarkedShows(globalData);
      setupSearch();
      
    } catch (error) {
      console.error("couldnt fetch", error);
    }
}
  
loadData();
