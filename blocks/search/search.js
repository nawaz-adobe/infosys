// Utility function to fetch JSON data
async function fetchJson(url, params, method) {
  try {
    const response = await fetch(`${url}?${new URLSearchParams(params)}`, { method });
    return await response.json();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return null;
  }
}

// Adjust search popup width based on the search block width
function adjustSearchPopupWidth() {
  const searchBlock = document.querySelector('.search.block');
  const searchPopup = searchBlock.querySelector('.search-popup');
  if (searchPopup && searchPopup.classList.contains('show-search')) {
    searchPopup.style.width = `${searchBlock.offsetWidth}px`;
  }
}

// Show the search popup
function showSearchPopup() {
  const searchBlock = document.querySelector('.search.block');
  const searchPopup = searchBlock.querySelector('.search-popup');
  if (searchPopup) {
    searchPopup.style.display = 'block';
    searchPopup.style.width = `${searchBlock.offsetWidth}px`;
    searchPopup.classList.add('show-search');
  }
}

// Hide the search popup and reset input
function hideSearchPopup() {
  const searchBlock = document.querySelector('.search.block');
  const searchPopup = searchBlock.querySelector('.search-popup');
  if (searchPopup) {
    searchPopup.style.display = 'none';
  }

  const crossIcon = searchBlock.querySelector('.icon-popup-cross');
  if (crossIcon) {
    crossIcon.style.display = 'none';
  }

  const searchInput = searchBlock.querySelector('.search-input .search');
  if (searchInput) {
    searchInput.value = '';
  }
}

// Toggle the visibility of the cross icon based on input value
function toggleCrossIcon() {
  const searchBlock = document.querySelector('.search.block');
  const searchInput = searchBlock.querySelector('.search-input .search');
  const crossIcon = searchBlock.querySelector('.icon-popup-cross');

  if (searchInput && crossIcon) {
    crossIcon.style.display = searchInput.value.length > 0 ? 'inline' : 'none';
  }
}

// Update search results with fetched data
function updateSearchResults(searchPopup, searchData) {
  const suggestionsRow = searchPopup.querySelector('.suggestions .row');
  suggestionsRow.innerHTML = '';

  if (searchData.length > 0) {
    searchData.forEach((item) => {
      const assetType = item.pageDescription || '';
      const description = item.assteTye || '';
      const image = `https://www.infosys.com${item.image}`;
      const resourcePath = `https://www.infosys.com${item.resourcePath}`.replace('/content/infosys-web/en', '');

      const articleHTML = `
        <div class="col-lg-6">
          <div class="most-recommended-article">
            <div class="article-image">
              <a href="${resourcePath}"><img src="${image}" alt="" class="img-fluid"></a>
            </div>
            <div class="article">
              ${assetType ? `<h5 class="article-heading"><a href="${resourcePath}" title="Go To Article">${assetType}</a></h5>` : ''}
              <p class="article-text">${description}</p>
            </div>
          </div>
        </div>
      `;
      suggestionsRow.insertAdjacentHTML('beforeend', articleHTML);
    });
  }
}

// Update suggestions list with fetched data
function updateSuggestionsList(searchPopup, suggestionsData, searchInput, dialog) {
  // dialog.dataset.skipCloseOnOutsideClick = "true";
  const searchList = searchPopup.querySelector('.search-list');
  dialog.dataset.extraBoundaryBottom = searchPopup.offsetHeight + 10;
  searchList.innerHTML = '';

  if (suggestionsData.length > 0) {
    suggestionsData.forEach((item) => {
      const suggestionText = item.assteTye || '';
      const listItem = document.createElement('li');

      listItem.innerHTML = `
        <span class="icon icon-search"></span>
        <a href="#" title="Go To Article">${suggestionText}</a>
        <span class="icon icon-slick-arrow"></span>
      `;

      listItem.addEventListener('click', (event) => {
        event.preventDefault();
        searchInput.value = suggestionText.trim();
        searchInput.dispatchEvent(new Event('keyup'));
      });

      searchList.appendChild(listItem);
    });
  }
}

// Handle search functionality and update results
async function triggerSearch() {
  const searchBlock = document.querySelector('.search.block');
  const dialog = searchBlock.closest('main').querySelector('dialog[data-link="/modals/search"]');
  const searchInput = searchBlock.querySelector('.search-input .search');
  const searchPopup = searchBlock.querySelector('.search-popup');
  const searchText = searchInput.value.trim();

  if (!searchText) {
    // eslint-disable-next-line no-console
    console.log('No Data is Entered');
    return;
  }

  const data = { textFieldIki: searchText };
  const searchInputContainer = searchBlock.querySelector('.search-input');
  const { action } = searchInputContainer.dataset;
  const { method } = searchInputContainer.dataset;
  const suggestionsAction = searchPopup.dataset.action;
  const suggestionsMethod = searchPopup.dataset.method;

  const [searchData, suggestionsData] = await Promise.all([
    fetchJson(action, data, method),
    fetchJson(suggestionsAction, data, suggestionsMethod),
  ]);

  if (searchData) {
    showSearchPopup();
    updateSearchResults(searchPopup, searchData);
  }

  if (suggestionsData) {
    updateSuggestionsList(searchPopup, suggestionsData, searchInput, dialog);
  }
}

// Create and return the search input div element
function createSearchInputDiv(searchText) {
  const searchInputDiv = document.createElement('div');
  searchInputDiv.classList.add('search-input');
  searchInputDiv.dataset.action = 'https://www.infosys.com/content/infosys-web/en/resource-type-servlets/ikisearch-servlet.iki';
  searchInputDiv.dataset.method = 'get';

  const iconSearchSpan = document.createElement('span');
  iconSearchSpan.classList.add('icon-search');

  const inputElement = document.createElement('input');
  inputElement.type = 'text';
  inputElement.classList.add('form-control', 'search');
  inputElement.name = 'k';
  inputElement.placeholder = searchText;
  inputElement.oninput = toggleCrossIcon;
  inputElement.onkeyup = triggerSearch;

  const iconPopupCrossSpan = document.createElement('span');
  iconPopupCrossSpan.classList.add('icon-popup-cross');
  iconPopupCrossSpan.onclick = hideSearchPopup;
  iconPopupCrossSpan.style.display = 'none';

  searchInputDiv.append(iconSearchSpan, inputElement, iconPopupCrossSpan);
  return searchInputDiv;
}

// Create and return the search popup div element
function createSearchPopupDiv() {
  const searchPopupDiv = document.createElement('div');
  searchPopupDiv.classList.add('search-popup');
  searchPopupDiv.dataset.action = 'https://www.infosys.com/content/infosys-web/en/resource-type-servlets/ikisuggestiondb-servlet.iki.iki-suggestiondb';
  searchPopupDiv.dataset.method = 'get';

  const suggestionsContainer = document.createElement('div');
  suggestionsContainer.classList.add('suggestions-container');
  const suggestions = document.createElement('div');
  suggestions.classList.add('suggestions');
  const row = document.createElement('div');
  row.classList.add('row');
  suggestions.appendChild(row);
  suggestionsContainer.appendChild(suggestions);

  const searchListContainer = document.createElement('div');
  searchListContainer.classList.add('search-list-container');
  const searchList = document.createElement('ul');
  searchList.classList.add('search-list');
  searchListContainer.appendChild(searchList);

  const suggestionRowElement = document.createElement('div');
  suggestionRowElement.classList.add('search-results');
  suggestionRowElement.append(searchListContainer, suggestionsContainer);
  searchPopupDiv.appendChild(suggestionRowElement);

  return searchPopupDiv;
}

// Create and return the search form element
function createSearchForm(searchText) {
  const form = document.createElement('form');
  form.action = '/iki/search.html';
  form.method = 'get';

  const searchInputDiv = createSearchInputDiv(searchText);
  const searchPopupDiv = createSearchPopupDiv();

  form.append(searchInputDiv, searchPopupDiv);
  return form;
}

// Initialize the search block with necessary elements and event listeners
export default async function decorate(block) {
  const container = document.createElement('div');
  container.innerHTML = block.innerHTML;
  block.innerHTML = '';

  const searchText = container.querySelector('p').textContent.trim();
  const form = createSearchForm(searchText);
  block.appendChild(form);
}

// ToDo: Remove this code if resizing is not required as it impacts performance
// Debounce resize events to avoid performance issues
let resizeTimeout;
window.addEventListener('resize', () => {
  if (resizeTimeout) {
    cancelAnimationFrame(resizeTimeout);
  }
  resizeTimeout = requestAnimationFrame(adjustSearchPopupWidth);
});
