import { createCustomElement } from '../../scripts/blocks-utils.js';
import { createForm, handleSubmit } from '../form/form.js';

const handleSubmitExternal = async (form) => {
  const url = 'https://marcom.infosys.com/services/forms/v1/response';
  const params = {};
  fetch(url, {
    method: 'POST',
    credentials: 'include',
    body: params,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'manual', // Set to 'auto' to follow redirection set in form processing step
  })
    .then(() => {
      form.style.display = 'none';
      const thankyoudiv = createCustomElement('div', 'thankyousub');
      const h4 = document.createElement('h4');
      h4.textContent = 'Thank you for subscription';
      thankyoudiv.appendChild(h4);
      thankyoudiv.style.display = 'block';
      form.parentElement.appendChild(thankyoudiv);
    });
};

const decorateColumnDiv = (titleLinkElement) => {
  const colDiv = createCustomElement('div', 'columns');
  const anchor = createCustomElement('a', '');
  const link = titleLinkElement.querySelector('a');
  if (link) {
    anchor.setAttribute('title', link.textContent);
    anchor.href = link.href;
  }
  const boxDiv = createCustomElement('div', 'box');
  const span1 = titleLinkElement.querySelector('span');
  if (span1) {
    span1.classList.add('header-icons');
    boxDiv.appendChild(span1);
  }

  const span2 = createCustomElement('span', '');
  span2.textContent = titleLinkElement.textContent;
  boxDiv.appendChild(span2);
  anchor.appendChild(boxDiv);
  colDiv.appendChild(anchor);

  return colDiv;
};

const showPopupDiv = (div) => {
  const subscriptionDiv = div.querySelector('.box');
  subscriptionDiv.style.display = 'none';
  const subscriptionPopUpDiv = div.querySelector('.popup');
  subscriptionPopUpDiv.classList.add('show');
  subscriptionPopUpDiv.style.top = subscriptionDiv.offsetTop - 100;
};

const checkEmailDomain = (form) => {
  const email = form.querySelector('.input-txt input').value;
  const domain = email.split('@')[1].split('.')[0];
  const invalidDomains = ['gmail', 'yahoo', 'outlook', 'rediffmail', 'hotmail', 'me'];
  if (invalidDomains.includes(domain)) {
    form.querySelector('.error-msg h2').style.opacity = '1';
    form.querySelector('.error-msg h2').textContent = 'Please enter Business Email';
    return false;
  }
  return true;
};

/**
 * Decorates the popup div by adding a class name and replacing anchor elements with loaded forms.
 * @param {HTMLElement} popupDiv - The popup div element to be decorated.
 * @returns {Promise<HTMLElement>} - The decorated popup div element.
 */
const decoratePopupDiv = async (popupDiv) => {
  if (popupDiv.children.length > 0) {
    const popupChildren = Array.from(popupDiv.children[0].children);
    const element = popupChildren[0];
    if (element.tagName.toLowerCase() === 'a'
      && element.href.endsWith('.json')) {
      const form = await createForm(element.href);
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const valid = form.checkValidity() && checkEmailDomain(form);
        if (valid) {
          handleSubmit(form);
          handleSubmitExternal(form);
        } else {
          const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
          if (firstInvalidEl) {
            firstInvalidEl.focus();
            firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
      element.replaceWith(form);
    }
  }
};

export default async function decorate(block) {
  const containerDiv = createCustomElement('div', 'container-fluid');
  [...block.children].forEach((row) => {
    const titleLinkDiv = row.children[0];
    const popupDiv = row.children[1];

    if (titleLinkDiv) {
      const colDiv = decorateColumnDiv(titleLinkDiv);
      if (popupDiv.children.length > 0) {
        popupDiv.className = 'popup';
        decoratePopupDiv(popupDiv);
        colDiv.insertBefore(popupDiv, colDiv.firstChild);
        colDiv.onclick = () => {
          showPopupDiv(colDiv);
        };
      }
      containerDiv.appendChild(colDiv);
    }
  });

  block.textContent = '';
  block.appendChild(containerDiv);
}
