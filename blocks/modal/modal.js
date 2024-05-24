/*
* Disclaimer: This block is copied from the AEM Block Collection.
* https://github.com/adobe/aem-block-collection/tree/main/blocks/modal
*/
import { loadFragment } from '../fragment/fragment.js';
import {
  buildBlock, decorateBlock, loadBlock, loadCSS,
} from '../../scripts/aem.js';

// This is not a traditional block, so there is no decorate function. Instead, links to
// a */modals/* path  are automatically transformed into a modal. Other blocks can also use
// the createModal() and openModal() functions.

export async function createModal(contentNodes, id) {
  const dialogs = document.querySelectorAll('dialog');

  let dialogAlreadyExists = false;

  dialogs.forEach((d) => {
    if (d.dataset?.link === id) {
      dialogAlreadyExists = true;
      d.showModal();
    }
  });

  if (dialogAlreadyExists) {
    return;
  }

  const filteredElementNodes = Array.from(contentNodes).filter((node) => node.nodeType === 1);
  const noCloseButton = filteredElementNodes.some((node) => node.classList.contains('no-close-button'));
  const fullWidth = filteredElementNodes.some((node) => node.classList.contains('full-width'));

  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement('dialog');
  dialog.dataset.link = id;
  if (fullWidth) {
    dialog.classList.add('full-width');
  }
  const dialogContent = document.createElement('div');
  dialogContent.classList.add('modal-content');
  dialogContent.append(...filteredElementNodes);
  dialog.append(dialogContent);

  if (!noCloseButton) {
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.setAttribute('aria-label', 'Close');
    closeButton.type = 'button';
    closeButton.innerHTML = '<span class="icon icon-bx-x"></span>';
    closeButton.addEventListener('click', () => dialog.close());
    dialog.append(closeButton);
  }

  // close dialog on clicks outside the dialog. https://stackoverflow.com/a/70593278/79461
  dialog.addEventListener('click', (event) => {
    const dialogDimensions = dialog.getBoundingClientRect();
    if (event.clientX < dialogDimensions.left || event.clientX > dialogDimensions.right
            || event.clientY < dialogDimensions.top || event.clientY > dialogDimensions.bottom) {
      dialog.close();
    }
  });

  const block = buildBlock('modal', '');
  document.querySelector('main').append(block);
  decorateBlock(block);
  await loadBlock(block);

  dialog.addEventListener('close', () => {
    document.body.classList.remove('modal-open');
    block.remove();
  });

  block.append(dialog);
  dialog.showModal();
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith('http')
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  await createModal(fragment.childNodes, path);
}
