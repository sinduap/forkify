import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import paginationView from './views/paginationView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async () => {
  try {
    const hashId = location.hash.replace(/#/, '');

    if (!hashId) return;

    recipeView.renderSpinner();

    await model.loadRecipe(hashId);

    recipeView.render(model.state.recipe);
  } catch (error) {
    recipeView.renderError();
  }
};

const controlSearchResults = async () => {
  try {
    const query = searchView.getQuery();

    if (!query) return;

    resultsView.renderSpinner();

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPaginationButtons = goToPage => {
  resultsView.render(model.getSearchResultsPage(goToPage));

  paginationView.render(model.state.search);
};

const init = () => {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandleSearchResults(controlSearchResults);
  paginationView.addHandlerClick(controlPaginationButtons);
};

init();
