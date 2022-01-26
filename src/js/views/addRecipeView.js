import View from './View';
import icons from 'url:../../img/icons.svg';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded';
  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.toggleWindow = this.toggleWindow.bind(this);
    this._hideWindow = this.toggleWindow.bind(this);
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  toggleWindow = function () {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  };

  _hideWindow = function () {
    this._overlay.classList.add('hidden');
    this._window.classList.add('hidden');
  };

  _addHandlerHideWindow() {
    this._overlay.addEventListener('click', this._hideWindow);
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow);
    this._btnClose.addEventListener('click', this.toggleWindow);
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = [...new FormData(this)];
      handler(data);
    });
  }
}

export default new AddRecipeView();
