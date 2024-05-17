import { createAemElement } from '../../scripts/blocks-utils.js';

const LEFT_ARROW = '../../icons/arrow-left-circle-thin.png';
const RIGHT_ARROW = '../../icons/arrow-right-circle-thin.png';
function getCurrentIndex(block) {
  const currentIndex = block.querySelector('.card-item.active');
  return [...block.querySelectorAll('.card-item')].indexOf(currentIndex);
}

function updateVisibleCardItems(cardsList, prevIndex, newIndex) {
  const cardItems = cardsList.querySelectorAll('.card-item');
  const visibleItems = parseInt(cardsList.getAttribute('data-visible-items'), 10);
  const newCardItem = cardItems[newIndex];
  if (newCardItem.style.display === 'block' || visibleItems === cardItems.length) return;

  cardItems.forEach((cardItem) => {
    cardItem.style.display = 'none';
  });

  let startIndex = newIndex;
  const animateClass = prevIndex < newIndex ? 'animate-r2l' : 'animate-l2r';
  if (visibleItems === 2 && newIndex % 2 === 1) startIndex = newIndex - 1;
  cardItems[startIndex].style.display = 'block';
  if (prevIndex !== newIndex) cardItems[startIndex].classList.add(animateClass);
  for (let i = startIndex + 1; i < Math.min(startIndex + visibleItems, cardItems.length); i += 1) {
    cardItems[i].style.display = 'block';
    if (prevIndex !== newIndex) cardItems[i].classList.add(animateClass);
  }
}

const setCardsListVisibleItems = (block) => {
  const desktopView = window.matchMedia('(min-width: 991px)');
  const tabletView = window.matchMedia('(max-width: 990px)');
  const mobileView = window.matchMedia('(max-width: 767px)');
  const cardsList = block.querySelector('.cards-list');

  if (desktopView.matches) {
    const cardItems = cardsList.querySelectorAll('.card-item');
    cardsList.setAttribute('data-visible-items', cardItems.length);
  }

  if (tabletView.matches) {
    cardsList.setAttribute('data-visible-items', 2);
  }

  if (mobileView.matches) {
    cardsList.setAttribute('data-visible-items', 1);
  }
  updateVisibleCardItems(cardsList, 0, 0);
};

function setBannerImage(banner, block) {
  const section = block.closest('.section');
  const bannerImg = banner.querySelector('.banner-img img').src;
  Object.assign(section.style, {
    backgroundImage: `url(${bannerImg})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  });
}

function setActiveItemsByIndex(block, prevIndex, newIndex) {
  const cardsList = block.querySelector('.cards-list');
  const newBanner = block.querySelector(`.banner-${newIndex}`);
  const newCardItem = block.querySelector(`.card-${newIndex}`);
  const newTile = block.querySelector(`.tile-${newIndex}`);
  newBanner.classList.add('active');
  newCardItem.classList.add('active');
  newTile.classList.add('active');
  setBannerImage(newBanner, block);
  updateVisibleCardItems(cardsList, prevIndex, newIndex);
}

function stopProgressBar(block) {
  const currentProgressBar = block.querySelector('.progress-bar[state="started"]');
  if (currentProgressBar) {
    currentProgressBar.style.width = '0px';
    currentProgressBar.setAttribute('state', 'ended');
  }

  const currentBanner = block.querySelector('.banner.active');
  if (currentBanner) currentBanner.classList.remove('active');

  const currentCardItem = block.querySelector('.card-item.active');
  if (currentCardItem) {
    currentCardItem.classList.remove('active');
    currentCardItem.classList.remove('animate-l2r');
    currentCardItem.classList.remove('animate-r2l');
  }

  const tile = block.querySelector('li.tile.active');
  if (tile) tile.classList.remove('active');

  clearTimeout(block.timeoutId);
}

function startProgressBar(block, currentIndex) {
  const progressBars = block.querySelectorAll('.progress-bar');
  const cardItemWidth = parseFloat(progressBars[currentIndex].style.maxWidth || 0);
  const progressBarJump = cardItemWidth / 100;
  const currentProgressBar = progressBars[currentIndex];
  let newIndex = currentIndex;

  block.timeoutId = setTimeout(() => {
    const width = parseFloat(currentProgressBar.style.width || 0) + progressBarJump;
    currentProgressBar.style.width = `${width}px`;
    currentProgressBar.setAttribute('state', 'started');

    // current progress bar reached 100% width
    if (width >= cardItemWidth) {
      stopProgressBar(block);
      // If last progress bar, scroll the cards list back to the first card
      newIndex = (currentIndex + 1) % progressBars.length;
      setActiveItemsByIndex(block, currentIndex, newIndex);
    }

    // Infinite loop to start the progress bar
    // 'newIndex' is updated once the current progress bar reaches 100% width
    startProgressBar(block, newIndex);
  }, 35);
}

function moveNextCard(block) {
  const cardItems = block.querySelectorAll('.card-item');
  const currentCardItem = block.querySelector('.card-item.active');
  const currentIndex = [...cardItems].indexOf(currentCardItem);
  const nextIndex = (currentIndex + 1) % cardItems.length;
  stopProgressBar(block);
  setActiveItemsByIndex(block, currentIndex, nextIndex);
  startProgressBar(block, nextIndex);
}

function movePrevCard(block) {
  const cardItems = block.querySelectorAll('.card-item');
  const currentCardItem = block.querySelector('.card-item.active');
  const currentIndex = [...cardItems].indexOf(currentCardItem);
  const prevIndex = (currentIndex - 1 + cardItems.length) % cardItems.length;
  stopProgressBar(block);
  setActiveItemsByIndex(block, currentIndex, prevIndex);
  startProgressBar(block, prevIndex);
}

function decorateHeroBanners(block) {
  const bannerWrapper = createAemElement('div', { class: 'banner-wrapper' });
  const banners = [...block.children];

  banners.forEach((banner, index) => {
    banner.classList.add('banner', `banner-${index}`);

    const bannerChildren = banner.children;
    const bannerImg = bannerChildren[0];
    bannerImg.classList.add('banner-img');

    const bannerContent = bannerChildren[1];
    bannerContent.classList.add('banner-content');

    bannerWrapper.appendChild(banner);
  });
  block.appendChild(bannerWrapper);
}

function decorateCardFindMoreButton(card) {
  const findMore = card.querySelector('p > a');
  if (!findMore) return;
  const findMoreLongRightArrowIcon = createAemElement('span', { class: 'icon-long-right-arrow' });
  const findMoreIcon = createAemElement('span', { class: 'icon-chevron-right-circle-white' });
  findMore.prepend(findMoreLongRightArrowIcon);
  findMore.prepend(findMoreIcon);
  findMore.classList.add('find-more');
}

function decorateArrowControls(block) {
  const leftControl = createAemElement(
    'button',
    { class: 'arrow' },
    { innerHTML: `<img src="${LEFT_ARROW}" alt="Left Arrow">` },
  );
  leftControl.addEventListener('click', () => movePrevCard(block));

  const rightControl = createAemElement(
    'button',
    { class: 'arrow' },
    { innerHTML: `<img src="${RIGHT_ARROW}" alt="Right Arrow">` },
  );
  rightControl.addEventListener('click', () => moveNextCard(block));
  const arrowControls = createAemElement('div', { class: 'arrow-controls' }, null, leftControl, rightControl);
  block.append(arrowControls);
}

function decorateTilesControls(block) {
  const banners = block.querySelectorAll('.banner');
  const tilesBar = createAemElement('ul', { class: 'tiles-bar' });
  for (let i = 0; i < banners.length; i += 1) {
    const tile = createAemElement('li', { class: `tile tile-${i}` });
    tile.addEventListener('click', () => {
      const currentIndex = getCurrentIndex(block);
      stopProgressBar(block);
      tile.classList.add('active');
      setActiveItemsByIndex(block, currentIndex, i);
      startProgressBar(block, i);
    });
    tilesBar.appendChild(tile);
  }
  block.append(tilesBar);
}

function decorateCardListWithControls(block) {
  decorateArrowControls(block);
  decorateTilesControls(block);
}

function decorateHeroSlidingCards(block) {
  const cardsList = createAemElement('div', { class: 'cards-list' });
  const banners = block.querySelectorAll('.banner');
  banners.forEach((banner, index) => {
    const cardHeading = createAemElement('h4', null, { innerHTML: banner.querySelector('h2').innerHTML });
    const bannerContent = banner.querySelector('.banner-content');
    const bannerContentChildren = [...bannerContent.children];
    const progressBar = createAemElement('div', { class: `progress-bar progress-bar-${index}`, state: 'none' });
    const card = createAemElement('div', { class: `card-item card-${index}` }, null, cardHeading, ...bannerContentChildren.slice(1), progressBar);
    const reportButton = createAemElement('a', { class: 'report-button' }, { innerHTML: 'Report', href: card.querySelector('a').href });
    bannerContent.prepend(reportButton);
    cardsList.appendChild(card);
    card.addEventListener('click', () => {
      const currentIndex = getCurrentIndex(block);
      stopProgressBar(block);
      setActiveItemsByIndex(block, currentIndex, index);
      startProgressBar(block, index);
    });
    decorateCardFindMoreButton(card);
  });
  block.append(cardsList);
}

const setProgressBarPosition = (block) => {
  const cardsList = block.querySelector('.cards-list');
  const cardItem = block.querySelector('.card-item');
  const cardItemRect = cardItem.getBoundingClientRect();
  const progressBars = block.querySelectorAll('.progress-bar');

  progressBars.forEach((progressBar) => {
    progressBar.style.maxWidth = `${cardItemRect.width}px`;
  });

  if (cardsList.getAttribute('progress-bar') !== 'initialised') {
    cardsList.setAttribute('progress-bar', 'initialised');
    setActiveItemsByIndex(block, 0, 0);
    startProgressBar(block, 0);
  }
};

function onLoadSetItemsPosition(block) {
  document.addEventListener('load', () => {
    setCardsListVisibleItems(block);
    setProgressBarPosition(block);
  }, true);

  window.addEventListener('resize', () => {
    const cardsList = block.querySelector('.cards-list');
    stopProgressBar(block);
    cardsList.setAttribute('progress-bar', 'none');
    setCardsListVisibleItems(block);
    setProgressBarPosition(block);
  });
}

export default function decorate(block) {
  decorateHeroBanners(block);
  decorateHeroSlidingCards(block);
  decorateCardListWithControls(block);
  onLoadSetItemsPosition(block);
}
