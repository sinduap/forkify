import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, STARTING_PAGE, API_KEY } from './config';
import {
  AJAX,
  saveBookmarks,
  loadBookmarks,
  isContainIngredient,
  isEmpty,
} from './helper';

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

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    servings: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (hashId) {
  try {
    const data = await AJAX(`${API_URL}${hashId}?key=${API_KEY}`);
    const recipe = createRecipeObject(data);

    state.recipe = {
      ...recipe,
      isBookmarked: state.bookmarks.some(b => b.id === recipe.id),
    };
  } catch (error) {
    console.error(`*** ${error} ***`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    const { recipes } = data.data;
    state.search.results = recipes.map(
      ({ id, title, key, publisher, image_url: imageUrl }) => ({
        id,
        title,
        publisher,
        imageUrl,
        ...(key && { key }),
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

  saveBookmarks(state.bookmarks);
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(b => b.id === id);
  state.bookmarks.splice(index, 1);
  if (state.recipe.id === id) state.recipe.isBookmarked = false;

  saveBookmarks(state.bookmarks);
};

export const uploadRecipe = async function (dataRecipe) {
  try {
    const formattedRecipe = dataRecipe
      .filter(([key, val]) => !(isContainIngredient(key) && isEmpty(val)))
      .map(([key, val]) => {
        if (isContainIngredient(key)) {
          const valArr = val.split(',').map(el => el.trim());
          if (valArr.length !== 3) {
            throw new Error('Wrong format');
          }
          const [quantity, unit, description] = valArr;
          return {
            [key]: {
              quantity: +quantity || null,
              unit: unit || null,
              description: description,
            },
          };
        }
        return { [key]: val };
      })
      .reduce((acc, entry) => {
        const [key, val] = Object.entries(entry)[0];
        if (isContainIngredient(key) && !acc.ingredients) {
          return { ...acc, ingredients: [val] };
        }
        if (isContainIngredient(key)) {
          return { ...acc, ingredients: [...acc.ingredients, val] };
        }
        return { ...acc, ...entry };
      }, {});

    const recipe = {
      title: formattedRecipe.title,
      source_url: formattedRecipe.sourceUrl,
      image_url: formattedRecipe.image,
      publisher: formattedRecipe.publisher,
      cooking_time: +formattedRecipe.cookingTime,
      servings: +formattedRecipe.servings,
      ingredients: formattedRecipe.ingredients,
    };

    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

const init = function () {
  const data = loadBookmarks();
  if (data) state.bookmarks = JSON.parse(data);
};

init();
