import View from './View';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parentElement = '';

  generateMarkup({ id, title, publisher, imageUrl }) {
    const hashId = window.location.hash.slice(1);

    return `
      <li class="preview">
        <a class="preview__link ${
          hashId === id ? 'preview__link--active' : ''
        }" href="#${id}">
          <figure class="preview__fig">
            <img src=${imageUrl} alt="${title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${title}</h4>
            <p class="preview__publisher">${publisher}</p>
          </div>
        </a>
      </li>
    `;
  }
}

export default new PreviewView();
