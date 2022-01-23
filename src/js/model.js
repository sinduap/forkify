import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, STARTING_PAGE } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultsPerPage: RES_PER_PAGE,
    page: STARTING_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (hashId) {
  try {
    const data = await getJSON(`${API_URL}${hashId}`);
    const {
      id,
      title,
      publisher,
      source_url: sourceUrl,
      image_url: imageUrl,
      ingredients,
      cooking_time: cookingTime,
      servings,
    } = data.data.recipe;

    state.recipe = {
      id,
      title,
      publisher,
      sourceUrl,
      imageUrl,
      ingredients,
      cookingTime,
      servings,
      isBookmarked: state.bookmarks.some(b => b.id === id),
    };
  } catch (error) {
    console.error(`*** ${error} ***`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}`);
    const { recipes } = data.data;
    state.search.results = recipes.map(
      ({ id, title, publisher, image_url: imageUrl }) => ({
        id,
        title,
        publisher,
        imageUrl,
      })
    );
    state.search.page = STARTING_PAGE; // reset starting page
  } catch (error) {
    console.error(`*** ${error} ***`);
    throw error;
  }
};

export const getSearchResultsPage = function (page = STARTING_PAGE) {
  state.search.page = page; // track current page
  const start = (page - 1) * RES_PER_PAGE;
  const end = page * RES_PER_PAGE;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  // Track servings
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (state.recipe.id === recipe.id) state.recipe.isBookmarked = true;
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.isBookmarked = false;
};
