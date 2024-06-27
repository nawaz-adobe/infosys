import { createCustomElement } from '../../scripts/blocks-utils.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const slidingContainer = createCustomElement('div', 'sliding-container');
  const innerContainer = createCustomElement('div', 'inner-container');
  const blockChildren = Array.from(block.children);
  blockChildren.forEach((row) => {
    const carouselItem = createCustomElement('div', 'carousel-item');

    const data = row.children[1];
    const cardHeading = createCustomElement('div', 'card-heading');
    const title = document.createElement('h5');
    title.textContent = data.querySelector('h5').textContent;

    const items = data.querySelectorAll('p');
    const linkDiv = items[0].querySelector('a');
    const link = document.createElement('a');
    link.href = linkDiv.href;
    link.textContent = linkDiv.textContent;

    cardHeading.appendChild(title);
    cardHeading.appendChild(link);

    const cardBody = createCustomElement('div', 'card-body');
    const description = document.createElement('p');
    description.textContent = items[1].textContent;
    const date = document.createElement('span');
    date.textContent = items[2].textContent;
    cardBody.appendChild(description);
    cardBody.appendChild(date);

    const imageDiv = createCustomElement('div', 'card-image');
    const image = row.children[0].querySelector('picture img');
    const picture = createOptimizedPicture(image.src, linkDiv.textContent, false, [{ width: '750' }]);

    const imageLink = document.createElement('a');
    imageLink.href = linkDiv.href;
    imageLink.appendChild(picture);
    imageDiv.appendChild(imageLink);

    carouselItem.appendChild(imageDiv);
    carouselItem.appendChild(cardHeading);
    carouselItem.appendChild(cardBody);

    innerContainer.appendChild(carouselItem);
  });

  let currentIndex = 0;

  const getVisibleItems = () => {
    if (window.innerWidth >= 1200) {
      return 3;
    }
    return 2;
  };

  const updateCarousel = () => {
    const offset = -currentIndex * (100 / getVisibleItems());
    innerContainer.style.transform = `translateX(${offset}%)`;
  };

  const updateDots = () => {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  const prevBtn = createCustomElement('span', 'icon');
  prevBtn.classList.add('icon-prev');

  const nextBtn = createCustomElement('span', 'icon');
  nextBtn.classList.add('icon-next');

  const dotsContainer = createCustomElement('div', 'carousel-dots');
  dotsContainer.appendChild(prevBtn);

  const dotListener = (index) => () => {
    currentIndex = index;
    updateCarousel();
    updateDots();
  };

  for (let i = 0; i <= blockChildren.length - getVisibleItems(); i += 1) {
    const dot = createCustomElement('span', 'carousel-dot');
    dot.addEventListener('click', dotListener(i));
    dotsContainer.appendChild(dot);
  }

  dotsContainer.appendChild(nextBtn);
  const totalItems = blockChildren.length;

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex -= 1;
    }
    updateCarousel();
    updateDots();
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < totalItems - getVisibleItems()) {
      currentIndex += 1;
    }
    updateCarousel();
    updateDots();
  });

  block.textContent = '';
  slidingContainer.appendChild(innerContainer);
  block.appendChild(slidingContainer);
  block.appendChild(dotsContainer);

  // Initialize the first active dot
  updateDots();
}
