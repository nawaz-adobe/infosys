import { createAemElement } from '../../scripts/blocks-utils.js';

const FILTER_CATEGORIES = {
  0: 'industry',
  1: 'technology',
  2: 'assetType',
};

// opens or closes the secondary view for mobile based on the 'openView' boolean value
function handleSecondaryViewsForMobile(row, openView = true) {
  const section = row.closest('.section');
  const mobileSecondaryView = section.querySelector('.mob-secondary-view');
  const primaryViewItems = section.querySelectorAll('.filters-grid-wrapper, .default-content-wrapper');

  if (openView) {
    const rect = section.getBoundingClientRect();
    mobileSecondaryView.style.minHeight = `${rect.height}px`;
    primaryViewItems.forEach((item) => {
      item.style.display = 'none';
    });

    mobileSecondaryView.style.display = 'flex';
    const mobRow = mobileSecondaryView.querySelector(`#${row.id}`);
    mobRow.classList.add('show');
  } else {
    row.classList.remove('show');
    mobileSecondaryView.style.display = 'none';
    primaryViewItems.forEach((item) => {
      item.style.display = 'block';
    });
  }
}

function openSecondaryView(row) {
  handleSecondaryViewsForMobile(row, true);
}

function closeSecondaryView(row) {
  handleSecondaryViewsForMobile(row, false);
}

function getSelectedFiltersInRow(row) {
  const checkedFilters = row.querySelectorAll('li:has(.filter-input:checked)');
  if (!checkedFilters) return [];
  return Array.from(checkedFilters).map((item) => item.querySelector('.filter-label').textContent);
}

function decorateRowHeading(row) {
  const h5 = row.querySelector('h5');
  if (h5) {
    const headingParent = h5.parentElement;
    const arrowControl = createAemElement('span', { class: 'icon icon-long-right-arrow' });
    const headingWrapper = createAemElement('div', { class: 'row-heading-wrapper' }, null, h5, arrowControl);
    const separator = createAemElement('div', { class: 'separator' });
    headingParent.prepend(separator);
    headingParent.prepend(headingWrapper);
    arrowControl.addEventListener('click', () => openSecondaryView(row));
  }
}

function decorateRowList(row) {
  const ul = row.querySelector('ul');
  if (ul) {
    ul.classList.add('filters-list');
    const li = [...ul.children];
    li.forEach((item) => {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.classList.add('filter-input');

      const label = document.createElement('label');
      label.classList.add('filter-label');
      label.textContent = item.textContent;
      item.textContent = '';

      item.prepend(checkbox);
      item.appendChild(label);
    });
  }
}

function decorateViewMore(row) {
  const viewMore = row.querySelector('p');
  const COLLAPSED_TEXT = 'View All';
  const EXPANDED_TEXT = 'View Less';
  if (viewMore && viewMore.textContent.trim() === COLLAPSED_TEXT) {
    const viewMoreLink = createAemElement('a', { class: 'view-all' }, { textContent: COLLAPSED_TEXT });
    viewMore.after(viewMoreLink);
    viewMore.remove();
    viewMoreLink.onclick = (event) => {
      event.preventDefault();
      const filtersList = row.querySelector('ul');
      viewMoreLink.textContent = filtersList.classList.contains('expanded') ? COLLAPSED_TEXT : EXPANDED_TEXT;
      filtersList.classList.toggle('expanded');
    };
  }
}

function decorateActionButton(block) {
  const section = block.closest('.section');
  const actionButton = section.querySelector('.filters-grid-wrapper + .default-content-wrapper p >  a');
  if (actionButton === null) return;
  actionButton.classList.add('action-button');
  actionButton.parentElement.classList.add('action-button-wrapper');
  actionButton.addEventListener('click', () => {
    const selectedFilters = {};
    const rows = block.querySelectorAll('.row');
    rows.forEach((row, index) => {
      const category = FILTER_CATEGORIES[index];
      const checkedFiltersItem = getSelectedFiltersInRow(row);
      if (checkedFiltersItem.length > 0) selectedFilters[category] = checkedFiltersItem;
    });
    const queryString = new URLSearchParams(selectedFilters).toString();
    actionButton.href = `${actionButton.href}?${queryString}`;
  });
}

function decorateSecondaryViewForMobile(block) {
  const rows = block.querySelectorAll('.row');
  const mobSecondaryView = createAemElement('div', { class: 'mob-secondary-view' });
  rows.forEach((row, index) => {
    const heading = row.querySelector('h5');
    if (!heading) return;
    const backArrow = createAemElement('span', { class: 'icon rotate-left icon-long-right-arrow' });
    const clonedHeading = heading.cloneNode(true);
    const headingWrapper = createAemElement('div', { class: 'heading-wrapper' }, null, backArrow, clonedHeading);
    const clonedUl = row.querySelector('ul').cloneNode(true);
    const mobRow = createAemElement('div', { class: 'row' }, { id: `row-${index}` }, headingWrapper, clonedUl);
    mobSecondaryView.append(mobRow);
    backArrow.addEventListener('click', () => closeSecondaryView(mobRow));
  });

  const continueButton = createAemElement('a', { class: 'continue-button' }, { textContent: 'Continue' });
  mobSecondaryView.append(continueButton);
  continueButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const activeRow = mobSecondaryView.querySelector('.row.show');
    const selectedFilters = getSelectedFiltersInRow(activeRow);
    closeSecondaryView(activeRow);

    const primaryRow = block.querySelector(`#${activeRow.id}`);
    const filtersList = primaryRow.querySelector('ul');
    const filters = filtersList.querySelectorAll('.filter-input');
    filters.forEach((filter) => {
      const label = filter.nextElementSibling;
      if (selectedFilters.includes(label.textContent)) {
        filter.checked = true;
      } else {
        filter.checked = false;
      }
    });
  });

  const section = block.closest('.section');
  section.append(mobSecondaryView);
}

function decorateBlockByView(block) {
  const mobileView = window.matchMedia('(max-width: 767px)');
  if (!mobileView.matches) {
    const section = block.closest('.section');
    const primaryViewItems = section.querySelectorAll('.filters-grid-wrapper, .default-content-wrapper');
    const mobileSecondaryView = section.querySelector('.mob-secondary-view');
    const rows = block.querySelectorAll('.row');
    primaryViewItems.forEach((item) => {
      item.style.display = 'block';
    });
    mobileSecondaryView.style.display = 'none';
    rows.forEach((row) => {
      row.style.display = 'block';
    });
  }
}

function handleWindowEvents(block) {
  window.addEventListener('resize', () => {
    decorateBlockByView(block);
  }, true);
}

export default function decorate(block) {
  const rows = [...block.children];
  rows.forEach((row, index) => {
    row.id = `row-${index}`;
    row.classList.add('row');
    decorateRowHeading(row);
    decorateRowList(row);
    decorateViewMore(row);
  });
  decorateActionButton(block);
  decorateSecondaryViewForMobile(block);
  handleWindowEvents(block);
}
