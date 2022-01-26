import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  /**
   * Render the received object to the DOM
   * @param {{} | []} data The data to be rendered
   * @returns {void} create side effects
   * @this {{}} View instance
   * @author Sindu Andita Pratama
   */
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      this.renderError();
      return;
    }

    this._data = data;
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Compare the current with the previous DOM, and only update the differences
   * @param {{} | []} data The data to be updated
   * @returns {void} create side effects
   * @this {{}} View instance
   * @author Sindu Andita Pratama
   */
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return;
    }

    this._data = data;
    const updatedMarkup = this._generateMarkup();

    const newDOM = document
      .createRange()
      .createContextualFragment(updatedMarkup);

    const newElements = [...newDOM.querySelectorAll('*')];
    const currElements = [...this._parentElement.querySelectorAll('*')];

    // Compare both ELEMENTS
    newElements.forEach((newEl, i) => {
      const curEl = currElements[i];

      // Updated changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }

      // Updated changed ATTRIBUTE
      if (!newEl.isEqualNode(curEl)) {
        [...newEl.attributes].forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
          <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._successMessage) {
    const markup = `
        <div class="message">
          <div>
          <svg>
              <use href="${icons}#icon-alert-smile"></use>
            </svg>
          </div>
          <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
      `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
