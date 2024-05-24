/* ToDo: This is in-progress */
function searchPopup() {
  const searchBlock = document.querySelector('.search.block');
  const searchPopupElement = searchBlock.querySelector('.search-popup');
  if (searchPopupElement) {
    searchPopupElement.style.display = 'block';
  }
}

function searchHide() {
  const searchBlock = document.querySelector('.search.block');
  const searchPopupElement = searchBlock.querySelector('.search-popup');
  if (searchPopupElement) {
    searchPopupElement.style.display = 'none';
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

function displayCross() {
  const searchBlock = document.querySelector('.search.block');
  const searchInput = searchBlock.querySelector('.search-input .search');
  const crossIcon = searchBlock.querySelector('.icon-popup-cross');

  if (searchInput && crossIcon) {
    if (searchInput.value.length > 0) {
      crossIcon.style.display = 'inline';
    } else {
      crossIcon.style.display = 'none';
    }
  }
}
export default async function decorate(block) {
  const container = document.createElement('div');
  container.innerHTML = block.innerHTML;
  block.innerHTML = '';
  const searchText = container.querySelector('p').textContent.trim();

  const form = document.createElement('form');
  form.setAttribute('action', '/iki/search.html');
  form.setAttribute('method', 'get');

  const searchInputDiv = document.createElement('div');
  searchInputDiv.classList.add('search-input');
  searchInputDiv.setAttribute('data-action', '/content/infosys-web/en/resource-type-servlets/ikisearch-servlet.iki');
  searchInputDiv.setAttribute('data-method', 'get');

  const iconSearchSpan = document.createElement('span');
  iconSearchSpan.classList.add('icon-search');

  const inputElement = document.createElement('input');
  inputElement.setAttribute('type', 'text');
  inputElement.classList.add('form-control', 'search');
  inputElement.setAttribute('name', 'k');
  inputElement.setAttribute('placeholder', searchText);
  inputElement.setAttribute('onfocus', searchPopup);
  inputElement.setAttribute('oninput', displayCross);

  const iconPopupCrossSpan = document.createElement('span');
  iconPopupCrossSpan.classList.add('icon-popup-cross');
  iconPopupCrossSpan.setAttribute('onclick', searchHide);
  iconPopupCrossSpan.style.display = 'none';

  searchInputDiv.appendChild(iconSearchSpan);
  searchInputDiv.appendChild(inputElement);
  searchInputDiv.appendChild(iconPopupCrossSpan);

  const searchPopupDiv = document.createElement('div');
  searchPopupDiv.classList.add('search-popup');

  form.appendChild(searchInputDiv);
  form.appendChild(searchPopupDiv);

  block.appendChild(form);
}
