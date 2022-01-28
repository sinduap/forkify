import View from './View';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!';
  _successMessage = '';

  show() {
    this._parentElement.closest('.search-results').classList.remove('hide');
    this._parentElement
      .closest('.container')
      .classList.add('grid-search-result');
  }

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

export default new ResultsView();
