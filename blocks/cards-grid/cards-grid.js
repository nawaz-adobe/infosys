import { createAemElement } from '../../scripts/blocks-utils.js';

const CARD_STYLES = {
  0: { cardData: 'center-aligned', cardImage: 'center', overlay: true },
  1: { cardData: 'left-aligned', cardImage: 'center', overlay: true },
  2: { cardData: 'left-aligned', cardImage: 'center', overlay: true },
  3: { cardData: 'left-aligned', cardImage: 'center', overlay: true },
  4: { cardData: 'left-sm-center-lg', cardImage: 'left-aligned', overlay: false },
  5: { cardData: 'left-aligned', cardImage: 'right-aligned', overlay: true },
};

function arrangeCardsInGrid(block) {
  const cards = block.querySelectorAll('.card');

  // Create the necessary containers as per the required grid template
  const clubbed1 = createAemElement('div', { class: 'column' }, { id: 'clubbed-1' });
  const clubbed2 = createAemElement('div', { class: 'row' }, { id: 'clubbed-2' });
  const clubbed3 = createAemElement('div', { class: 'row' }, { id: 'clubbed-3' });
  const clubbed4 = createAemElement('div', { class: 'row' }, { id: 'clubbed-4' });

  // Arrange the cards in the grid
  clubbed1.append(cards[1], cards[2]);
  clubbed2.append(clubbed1, cards[3]);
  clubbed3.append(cards[0], clubbed2);
  clubbed4.append(cards[4], cards[5]);

  // Append the containers to the block
  block.append(clubbed3, clubbed4);
}

function decorateFindMoreLinkDesktop(findMore) {
  const findMoreIcon = createAemElement('span', { class: 'icon-chevron-right-circle-white' });
  const findMoreLongRightArrowIcon = createAemElement('span', { class: 'icon-long-right-arrow' });
  findMore.prepend(findMoreIcon);
  findMore.append(findMoreLongRightArrowIcon);
}

function createFindMoreLinkMobile(block) {
  const cards = block.querySelectorAll('.card');
  cards.forEach((card) => {
    const cardFindMoreLink = card.querySelector('.find-more-desktop');
    const cardFindMoreLinkClone = cardFindMoreLink.cloneNode(true);
    cardFindMoreLinkClone.classList.remove('find-more-desktop');
    cardFindMoreLinkClone.classList.add('find-more-mobile');
    card.after(cardFindMoreLinkClone);
  });
}

function decorateCards(block) {
  const cards = [...block.children];
  cards.forEach((card, index) => {
    const cardItems = [...card.children];
    const cardImage = cardItems[0];
    const cardData = cardItems[1];

    card.id = `card-${index + 1}`;
    card.classList.add('card', 'hover');
    if (CARD_STYLES[index].overlay) {
      card.classList.add('overlay');
    }

    cardData.classList.add('card-data', CARD_STYLES[index].cardData);
    cardImage.classList.add('card-image', CARD_STYLES[index].cardImage);

    const cardDataItems = [...cardData.children];
    const cardTitleLink = cardDataItems[0] ? cardDataItems[0].querySelector('a') : '';
    const cardFindMoreLink = cardDataItems[1] ? cardDataItems[1].querySelector('a') : '';

    if (cardTitleLink) {
      cardTitleLink.classList.add('card-title-link');
      cardTitleLink.classList.remove('button');

      const findMoreLongRightArrowIcon = createAemElement('span', { class: 'icon-long-right-arrow white' });
      findMoreLongRightArrowIcon.style.color = 'white';
      cardTitleLink.append(findMoreLongRightArrowIcon);

      const cardTitleParent = cardTitleLink.parentElement;
      if (cardTitleParent.tagName === 'P') cardTitleParent.remove();
      const cardTitle = createAemElement('h3', { class: 'card-title' }, null, cardTitleLink);
      cardData.appendChild(cardTitle);
    }

    if (cardFindMoreLink) {
      cardFindMoreLink.classList.add('find-more-desktop');
      cardFindMoreLink.classList.remove('button');
      const cardFindMoreLinkParent = cardFindMoreLink.parentElement;
      if (cardFindMoreLinkParent.tagName === 'P') cardFindMoreLinkParent.remove();
      cardData.appendChild(cardFindMoreLink);
      decorateFindMoreLinkDesktop(cardFindMoreLink);
    }
  });
}

export default function decorate(block) {
  decorateCards(block);
  arrangeCardsInGrid(block);
  createFindMoreLinkMobile(block);
}
