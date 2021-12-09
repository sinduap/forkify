import View from './View';

import icons from 'url:../../img/icons.svg';
import { Fraction } from 'fractional';

class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = "We couldn't find that recipe. Please try again!";
  _successMessage = '';

  addHandleRender(handler) {
    const configAddEventListener = {
      events: ['hashchange', 'load'],
      handler,
    };

    configAddEventListener.events.map(evt =>
      window.addEventListener(evt, configAddEventListener.handler)
    );
  }

  _generateMarkup() {
    const {
      id,
      imageUrl,
      sourceUrl,
      servings,
      title,
      ingredients,
      cookingTime,
      publisher,
    } = this._data;
    return `
    <figure class="recipe__fig">
    <img src=${imageUrl} alt="Tomato" class="recipe__img" />
      <h1 class="recipe__title">
      <span>${title}</span>
      </h1>
      </figure>
      
      <div class="recipe__details">
      <div class="recipe__info">
      <svg class="recipe__info-icon">
      <use href="${icons}#icon-clock"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--minutes">${cookingTime}</span>
      <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
      <svg class="recipe__info-icon">
      <use href="${icons}#icon-users"></use>
      </svg>
      <span class="recipe__info-data recipe__info-data--people">${servings}</span>
      <span class="recipe__info-text">servings</span>

      <div class="recipe__info-buttons">
      <button class="btn--tiny btn--increase-servings">
      <svg>
      <use href="${icons}#icon-minus-circle"></use>
      </svg>
      </button>
      <button class="btn--tiny btn--increase-servings">
      <svg>
      <use href="${icons}#icon-plus-circle"></use>
      </svg>
      </button>
      </div>
      </div>
      
      <div class="recipe__user-generated">
     
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._generateMarkupIngredients(ingredients)}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${publisher}</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href=${sourceUrl}
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  }

  _generateMarkupIngredients(ingredients) {
    return ingredients
      .map(
        ({ description, quantity, unit }) => `
          <li class="recipe__ingredient">
            <svg class="recipe__icon">
              <use href="${icons}#icon-check"></use>
            </svg>
            <div class="recipe__quantity">${
              quantity ? new Fraction(quantity).toString() : ''
            }</div>
            <div class="recipe__description">
              <span class="recipe__unit">${unit || ''}</span>
              ${description}
            </div>
          </li>`
      )
      .join('');
  }
}

export default new RecipeView();
