import View from './View';
import icons from 'url:../../img/icons.svg';

class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find an recipe and bookmark it!';
  _successMessage = '';

  _generateMarkup() {
    return this._data.map(this._generateMarkupPreview).join('');
  }

  _generateMarkupPreview({ id, title, publisher, imageUrl }) {
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

export default new BookmarksView();
