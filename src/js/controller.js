import * as model from './model';
import recipeView from './views/recipeView';
import searchView from './views/searchView';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

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

const controlSearchResult = async () => {
  try {
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResult(query);
  } catch (error) {
    console.log(error);
  }
};

const init = () => {
  recipeView.addHandleRender(controlRecipes);
  searchView.addHandleSearchresult(controlSearchResult);
};

init();
