import { createAemElement, getPlaceHolders } from '../../scripts/blocks-utils.js';

const PLACEHOLDERS = {
  report: 'Report',
};

function getCurrentIndex(block) {
  const currentIndex = block.querySelector('.card-item.active');
  return [...block.querySelectorAll('.card-item')].indexOf(currentIndex);
}

function getCardItemWidthByIndex(block, index) {
  const cardItems = block.querySelectorAll('.card-item') || [];
  const cardItemRect = index < cardItems.length
    ? cardItems[index].getBoundingClientRect() : { width: 0 };
  let { width } = cardItemRect;
  if (width === 0) {
    const cardsList = block.querySelector('.cards-list');
    const cardsListRect = cardsList.getBoundingClientRect();
    width = cardItems.length > 0 ? cardsListRect.width / cardItems.length : cardsListRect.width;
  }
  return width;
}

function updateVisibleCardItems(cardsList, prevIndex, newIndex) {
  const cardItems = Array.from(cardsList.querySelectorAll('.card-item'));
  const visibleItemsCount = parseInt(cardsList.getAttribute('data-visible-items'), 10);
  const newCardItem = cardItems[newIndex];
  if (prevIndex !== newIndex && newCardItem.style.display === 'block') return;

  cardItems.forEach((cardItem) => {
    cardItem.style.display = 'none';
  });

  let startIndex = newIndex;
  const animateClass = prevIndex < newIndex ? 'animate-r2l' : 'animate-l2r';
  if (visibleItemsCount === 2 && newIndex % 2 === 1) startIndex = newIndex - 1;
  cardItems[startIndex].style.display = 'block';
  if (prevIndex !== newIndex) cardItems[startIndex].classList.add(animateClass);
  // eslint-disable-next-line max-len
  for (let i = startIndex + 1; i < Math.min(startIndex + visibleItemsCount, cardItems.length); i += 1) {
    cardItems[i].style.display = 'block';
    if (prevIndex !== newIndex) cardItems[i].classList.add(animateClass);
  }
}

function setBannerImage(banner, block) {
  const blockParentElement = block.parentElement;
  const bannerNumber = banner.id.split('-')[1];
  const activeBannerImg = blockParentElement.querySelector(`#banner-img-${bannerNumber}`);
  if (activeBannerImg) {
    activeBannerImg.classList.add('active');
  }
}

function stopAllActiveItems(block) {
  const currentProgressBar = block.querySelector('.progress-bar[state="started"]');
  if (currentProgressBar) {
    currentProgressBar.style.width = '0px';
    currentProgressBar.setAttribute('state', 'ended');
  }

  const currentActiveBanners = block.querySelectorAll('.banner.active');
  if (currentActiveBanners && currentActiveBanners.length > 0) {
    currentActiveBanners.forEach((banner) => {
      banner.classList.remove('active');
    });
  }

  const currentActiveBannerImgs = block.parentElement.querySelectorAll('.banner-img.active');
  if (currentActiveBannerImgs && currentActiveBannerImgs.length > 0) {
    currentActiveBannerImgs.forEach((bannerImg) => {
      bannerImg.classList.remove('active');
    });
  }

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

function setActiveItemsByIndex(block, prevIndex, newIndex) {
  const cardsList = block.querySelector('.cards-list');
  const newBanner = block.querySelector(`#banner-${newIndex}`);
  const newCardItem = block.querySelector(`.card-${newIndex}`);
  const newTile = block.querySelector(`.tile-${newIndex}`);
  // make sure all active items are stopped before setting new active items
  stopAllActiveItems(block);

  // update active items
  newBanner.classList.add('active');
  newCardItem.classList.add('active');
  newTile.classList.add('active');
  setBannerImage(newBanner, block);
  updateVisibleCardItems(cardsList, prevIndex, newIndex);
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
  setActiveItemsByIndex(block, 0, 0);
};

function startProgressBar(block, currentIndex) {
  const progressBars = block.querySelectorAll('.progress-bar');
  const cardItemWidth = getCardItemWidthByIndex(block, currentIndex);
  const progressBarJump = cardItemWidth / 100;
  const currentProgressBar = progressBars[currentIndex];
  let newIndex = currentIndex;

  block.timeoutId = setTimeout(() => {
    const width = parseFloat(currentProgressBar.style.width || 0) + progressBarJump;
    currentProgressBar.style.width = `${width}px`;
    currentProgressBar.setAttribute('state', 'started');

    // current progress bar reached 100% width
    if (width >= cardItemWidth) {
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
  setActiveItemsByIndex(block, currentIndex, nextIndex);
  startProgressBar(block, nextIndex);
}

function movePrevCard(block) {
  const cardItems = block.querySelectorAll('.card-item');
  const currentCardItem = block.querySelector('.card-item.active');
  const currentIndex = [...cardItems].indexOf(currentCardItem);
  const prevIndex = (currentIndex - 1 + cardItems.length) % cardItems.length;
  setActiveItemsByIndex(block, currentIndex, prevIndex);
  startProgressBar(block, prevIndex);
}

function decorateHeroBanners(block) {
  const bannerWrapper = createAemElement('div', { class: 'banner-wrapper' });
  const banners = [...block.children];

  banners.forEach((banner, index) => {
    banner.id = `banner-${index}`;
    banner.classList.add('banner');

    const bannerChildren = banner.children;
    const bannerImg = bannerChildren[0];
    bannerImg.id = `banner-img-${index}`;
    bannerImg.classList.add('banner-img');

    const bannerContent = bannerChildren[1];
    bannerContent.classList.add('banner-content');

    bannerWrapper.appendChild(banner);
  });
  block.appendChild(bannerWrapper);

  // decorate hero slider wrapper with background div
  // move banner images to background div
  const heroSliderBlockWrapper = block.parentElement;
  const heroSliderBackgroundDiv = createAemElement('div', { class: 'hero-slider-background' });
  heroSliderBlockWrapper.prepend(heroSliderBackgroundDiv);
  const bannerImgs = block.querySelectorAll('.banner-img');
  bannerImgs.forEach((bannerImg) => {
    heroSliderBackgroundDiv.appendChild(bannerImg);
  });
}

function decorateCardFindMoreButton(card) {
  const findMore = card.querySelector('p > a');
  if (!findMore) return;
  const findMoreLongRightArrowIcon = createAemElement('span', { class: 'icon-long-right-arrow' });
  const findMoreIcon = createAemElement('span', { class: 'icon-chevron-right-circle-white' });
  findMore.prepend(findMoreLongRightArrowIcon);
  findMore.prepend(findMoreIcon);
  findMore.classList.add('find-more');

  // seo: making link descriptive
  const cardHeading = card.querySelector('h4');
  if (cardHeading) {
    findMore.title = cardHeading.textContent;
  }
}

function decorateArrowControls(block) {
  const leftControl = createAemElement(
    'button',
    { class: 'arrow left', 'aria-label': 'previous' },
  );
  leftControl.addEventListener('click', () => movePrevCard(block));

  const rightControl = createAemElement(
    'button',
    { class: 'arrow right', 'aria-label': 'next' },
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
    const reportButton = createAemElement('a', { class: 'report-button' }, { innerHTML: PLACEHOLDERS.report, href: card.querySelector('a').href });
    bannerContent.prepend(reportButton);
    cardsList.appendChild(card);
    card.addEventListener('click', () => {
      const currentIndex = getCurrentIndex(block);
      setActiveItemsByIndex(block, currentIndex, index);
      startProgressBar(block, index);
    });
    decorateCardFindMoreButton(card);
  });
  block.append(cardsList);
}

const setProgressBarPosition = (block) => {
  const cardsList = block.querySelector('.cards-list');

  if (cardsList.getAttribute('progress-bar') !== 'initialised') {
    cardsList.setAttribute('progress-bar', 'initialised');
    setActiveItemsByIndex(block, 0, 0);
    startProgressBar(block, 0);
  }
};

function onLoadSetItemsPosition(block) {
  document.addEventListener('load', () => {
    const onLoadEventHandled = block.getAttribute('data-onload-event');
    if (onLoadEventHandled === 'true') return;
    setCardsListVisibleItems(block);
    setProgressBarPosition(block);
    block.setAttribute('data-onload-event', 'true');
  }, true);

  window.addEventListener('resize', () => {
    const cardsList = block.querySelector('.cards-list');
    stopAllActiveItems(block);
    cardsList.setAttribute('progress-bar', 'none');
    setCardsListVisibleItems(block);
    setProgressBarPosition(block);
  });
}

export default async function decorate(block) {
  await getPlaceHolders(PLACEHOLDERS);
  decorateHeroBanners(block);
  decorateHeroSlidingCards(block);
  decorateCardListWithControls(block);
  onLoadSetItemsPosition(block);
}
