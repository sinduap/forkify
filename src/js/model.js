import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    result: [],
  },
};

export const loadRecipe = async hashId => {
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
    };
  } catch (error) {
    console.error(`${error} ******`);
    throw error;
  }
};

export const loadSearchResult = async query => {
  try {
    state.search.query = query;

    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.result = data.data.recipes.map(
      ({ id, title, publisher, image_url }) => {
        return {
          id,
          title,
          publisher,
          imageUrl: image_url,
        };
      }
    );
  } catch (error) {
    console.error(`${error} ******`);
    throw error;
  }
};
